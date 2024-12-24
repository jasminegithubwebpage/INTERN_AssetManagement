const express = require('express');
const sql = require('mssql');
const config = require('../dbconfig'); // Ensure this points to your DB configuration
const router = express.Router();
// console.log('issue page');
const jwt = require("jsonwebtoken"); // Make sure to require jwt
const secretKey = process.env.JWT_SECRET // Use the same secret key as in login route
// console.log(secretKey);

router.get('/a', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided or invalid format" });
    }
  
    const token = authHeader.split(" ")[1];
    let decoded;
  
    try {
      decoded = jwt.verify(token, secretKey); // Decode the token and verify
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  
    const emp = decoded.id; // Extract employee ID from decoded token
    
    if (!emp) {
      return res.status(400).json({ message: "Employee ID not found in token" });
    }
  
    // SQL Injection Protection using parameterized queries
    await sql.connect(config);
    const request = new sql.Request();
    request.input('emp', sql.VarChar, emp); // Declare the parameter properly
    const result = await request.query(`
      SELECT t_asno, t_nama
      FROM ttxtvs1109001
      WHERE t_cusr = @emp
    `);
  
    res.json(result.recordset); // Return the result as JSON
  
  } catch (err) {
    console.error("Error:", err.message); // Log the exact error
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
  
});
router.get('/list_emp', async (req, res) => {
  const query = `
    SELECT DISTINCT e.t_emno as emp_id ,e.t_nama  as emp_name
    FROM ttccom0019001 e 
    RIGHT JOIN ttxtvs1159001 i ON i.t_emno = e.t_emno
  `;
  // console.log('issue raised emp');
  try {
    await sql.connect(config);
    const result = await sql.query(query); 
    const employees = result.recordset; 
    // console.log(employees);
    res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching employee names:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// router.put('/updation/:id', async (req, res) => {
//   const { id } = req.params; // Issue number (t_isno)
//   const { t_ists, t_hcmt, t_cldt} = req.body; // Updated fields
//   // console.log(id);
//   const query = `
//     UPDATE ttxtvs1159001
//     SET t_ists = @t_ists,
//         t_hcmt = @t_hcmt,
       
//         t_cldt = @t_cldt
//     WHERE t_isno = @id
//   `;

//   try {
//     await sql.connect(config);

//     const request = new sql.Request();
//     request.input('t_ists', sql.Int, t_ists);
//     request.input('t_hcmt', sql.NVarChar, t_hcmt || null);

//     request.input('t_cldt', sql.DateTime, t_cldt|| null);
//     request.input('id', sql.NVarChar, id);

//     const result = await request.query(query);

//     if (result.rowsAffected[0] > 0) {
//       res.status(200).json({ message: 'Issue updated successfully!' });
//     } else {
//       res.status(404).json({ message: 'Issue not found!' });
//     }
//   } catch (error) {
//     console.error('Error updating issue:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


router.put('/updation/:id', async (req, res) => {
  const { id } = req.params; // Issue number (t_isno)
  const { t_ists, t_hcmt, t_cldt } = req.body; // Updated fields

  // SQL query for updating the issue details
  const updateQuery = `
    UPDATE ttxtvs1159001
    SET t_ists = @t_ists,
        t_hcmt = @t_hcmt,
        t_cldt = @t_cldt
    WHERE t_isno = @id
  `;

  try {
    await sql.connect(config);

    const request = new sql.Request();
    request.input('t_ists', sql.Int, t_ists);
    request.input('t_hcmt', sql.NVarChar, t_hcmt || null);
    request.input('t_cldt', sql.DateTime, t_cldt || null);
    request.input('id', sql.NVarChar, id);

    const updateResult = await request.query(updateQuery);

    if (updateResult.rowsAffected[0] > 0) {
      // Fetch t_emno based on t_isno
      const emnoQuery = `
        SELECT i.t_emno,i.t_asno,a.t_nama,t_isdt,t_idsc
        FROM ttxtvs1159001 i left join ttxtvs1109001 a  on i.t_asno = a.t_asno
        WHERE t_isno = @id
      `;
      const emnoResult = await request.query(emnoQuery);

      if (emnoResult.recordset.length > 0  && t_ists==3)  {
        const t_emno = emnoResult.recordset[0].t_emno;
        const t_isdt = emnoResult.recordset[0].t_isdt;
       

           const date = t_isdt.toISOString().split('T')[0];

          // Output: "2024-12-23" (or current date)

        const t_idsc = emnoResult.recordset[0].t_idsc;






        // Fetch t_email based on t_emno
        const emailQuery = `
          SELECT t_mail
          FROM ttccom0019001
          WHERE t_emno = @t_emno
        `;
        request.input('t_emno', sql.NVarChar, t_emno);
        const emailResult = await request.query(emailQuery);

        if (emailResult.recordset.length > 0) {
          const employeeEmail = emailResult.recordset[0].t_email;

          // Send email notification
          const transporter = nodemailer.createTransport({
            host: '192.168.101.15',
            port: 25,
            secure: false,
            
          });

          const mailOptions = {
            from: 'automail@tvsss.co.in',
            to: employeeEmail,
            subject: 'Issue Update Notification',
            text: `
              
                 We would like to inform you that the following hardware issue has been updated:

    - Issue Raised Date: ${date}
    - Issue Description: ${t_idsc}
    - Hardware Engineer's Description: ${t_hcmt}
    - Current Status: Closed

    If you have any further questions or concerns, please feel free to reach out.
            `,
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error('Error sending email:', error);
            } else {
              console.log('Email sent:', info.response);
            }
          });
        } else {
          console.error('No email found for the given employee number.');
        }
      }

      res.status(200).json({ message: 'Issue updated successfully!' });
    } else {
      res.status(404).json({ message: 'Issue not found!' });
    }
  } catch (error) {
    console.error('Error updating issue:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get("/list", async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query(`
      SELECT 
        i.t_isno,
        i.t_ists,
        DATEADD(MINUTE, 330, i.t_isdt) AS t_isdt,
        i.t_idsc,
        i.t_asno,
        i.t_emno,
        i.t_hcmt,
        a.t_nama,
        e.t_nama AS empname 
      FROM 
        ttxtvs1159001 i 
      LEFT JOIN 
        ttxtvs1109001 a 
      ON  
        i.t_asno = a.t_asno 
      LEFT JOIN 
        ttccom0019001 e 
      ON 
        e.t_emno = a.t_cusr;
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

 

// router.get('/a/:empId', (req, res) => {
//   const { empId } = req.params;
//   // Example logic: Query your database using the empId
//   console.log(`Fetching assets for employee ID: ${empId}`);
//   // Mocked database response
//   res.json([{ id: 'ASSET01', name: 'Laptop' }, { id: 'ASSET02', name: 'Printer' }]);
// });



router.get('/', async (req, res) => {
    // console.log('inside');
    try {
      // 1. Get and validate the Authorization header
      const authHeader = req.headers.authorization;
  
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided or invalid format" });
      }
  
      const token = authHeader.split(" ")[1];
      // console.log("Token Received:", token);
  
      // 2. Verify the token and extract the employee ID
      let decoded;
      try {
        decoded = jwt.verify(token, secretKey);
        // console.log("Decoded Token:", decoded);
      } catch (err) {
        console.error("JWT Verification Error:", err.message);
        return res.status(401).json({ message: "Invalid or expired token" });
      }
  
      const empId = decoded.id; // Extract employee ID
      // console.log("Employee ID from Token:", empId);
  
      if (!empId) {
        return res.status(400).json({ message: "Employee ID not found in token" });
      }
  
      // 3. Connect to the database and fetch issues
      await sql.connect(config);
      const result = await sql.query(`
        SELECT 
          t_isno, 
          DATEADD(MINUTE, 330, t_isdt) AS t_isdt,  
          a.t_nama, 
          i.t_emno, 
          i.t_idsc, 
          i.t_ists, 
          i.t_hcmt
        FROM ttxtvs1159001 i 
        LEFT JOIN ttxtvs1109001 a ON i.t_asno = a.t_asno
        WHERE i.t_emno = '${empId}'`);
  
      // console.log("Query result:", result.recordset);
  
      // 4. Send response
      res.json(result.recordset);
    } catch (err) {
      console.error("Error fetching issues:", err.message);
      res.status(500).json({ error: "Failed to fetch issues", details: err.message });
    }
});

  
  
// Store Issue Data
const nodemailer = require('nodemailer'); // Import Nodemailer

router.post('/submit', async (req, res) => {
  const { t_isdt, t_asno, t_emno, t_idsc, t_ists, t_hcmt, t_cldt, t_Refcntd, t_Refcntu } = req.body;
  console.log(t_isdt);
  console.log(t_cldt);
  await sql.connect(config);

  // Validate input
  if (!t_isdt || !t_asno || !t_emno || !t_idsc || !t_ists || t_Refcntd === undefined || t_Refcntu === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Step 1: Fetch the latest issue number
    const latestIssueResult = await sql.query(`
      SELECT TOP 1 t_isno 
      FROM ttxtvs1159001
      ORDER BY t_isno DESC
    `);

    let newIssueNo = 'ISU000001'; // Default issue number

    if (latestIssueResult.recordset.length > 0) {
      const latestIssueNo = latestIssueResult.recordset[0].t_isno;
      
      // Step 2: Extract the numeric part of the latest issue number
      const numberPart = parseInt(latestIssueNo.replace('ISU', ''), 10);
      
      // Step 3: Increment the number
      const incrementedNumber = numberPart + 1;

      // Step 4: Format the number to be 6 digits with leading zeros
      newIssueNo = `ISU${incrementedNumber.toString().padStart(6, '0')}`;
    }
     console.log(newIssueNo);
    // Step 5: Prepare and execute the insert query including all columns
    const queryString = `
      INSERT INTO ttxtvs1159001 (t_isno, t_isdt, t_asno, t_emno, t_idsc, t_ists, t_hcmt, t_cldt, t_Refcntd, t_Refcntu)
      VALUES (@t_isno, @t_isdt, @t_asno, @t_emno, @t_idsc, @t_ists, @t_hcmt, @t_cldt, @t_Refcntd, @t_Refcntu)
    `;
    
    const request = new sql.Request();
    request.input('t_isno', sql.VarChar, newIssueNo);  // Pass the generated issue number
    request.input('t_isdt', sql.DateTime, t_isdt);
    request.input('t_asno', sql.VarChar, t_asno);
    request.input('t_emno', sql.VarChar, t_emno);
    request.input('t_idsc', sql.VarChar, t_idsc);
    request.input('t_ists', sql.Int, t_ists);  // Assuming `t_ists` is a string
    request.input('t_hcmt', sql.VarChar, t_hcmt);  // Assuming `t_hcmt` is a string
    request.input('t_cldt', sql.DateTime, t_cldt);
    request.input('t_Refcntd', sql.Int, t_Refcntd);  // Assuming `t_Refcntd` is an integer
    request.input('t_Refcntu', sql.Int, t_Refcntu);  // Assuming `t_Refcntu` is an integer

    const result = await request.query(queryString);

    const queries = `
    SELECT DISTINCT m.t_nama
    FROM ttxtvs1109001 m
    LEFT JOIN ttxtvs1159001 i ON m.t_asno = i.t_asno
    WHERE i.t_isno = @newIssueNo
  `;
  
  const request2 = new sql.Request();
  request2.input('newIssueNo', sql.VarChar, newIssueNo);
  let AssetName = '';
  try {
    const result = await request2.query(queries);
    
    console.log('Query Result:', result); // Log the entire result
    console.log('Recordset:', result.recordset); // Log recordset specifically
    
    if (result.recordset && result.recordset.length > 0) {
      AssetName = result.recordset[0].t_nama;
      console.log('Asset Name:', AssetName);
    } else {
      console.log('No asset found for the issue number');
      return res.status(404).json({ error: 'No asset found for the issue number' });
    }
  } catch (error) {
    console.error('Error fetching asset name:', error);
    return res.status(500).json({ error: 'Failed to fetch asset name' });
  }
  
   // Step 7: Set up the Nodemailer transporter
   const transporter = nodemailer.createTransport({
    host: '192.168.101.15',
    port: 25,
    secure: false, // Use TLS
    
  });
  


const engineerEmail = "jasminejasmine0582@gmail.com";
let date = ''; 
if (t_isdt instanceof Date && !isNaN(t_isdt)) {
  date = t_isdt.toISOString().split('T'); // Date part only (YYYY-MM-DD)
  console.log(date); // Output the date in YYYY-MM-DD format
} else {
  console.error('Invalid date format for t_isdt:', t_isdt);
}

const mailOptions = {
  from:`automail@tvsss.co.in`, 
  to: `${engineerEmail}`, 
  subject: `New Issue Reported - ${newIssueNo}`,
  text: `
  A new issue has been reported:
  
  ISSUE ID: ${newIssueNo}
  ASSET NAME: ${AssetName}
  ISSUE DESCRIPTION: ${t_idsc}
  ISSUE STATUS: OPENED
  
  Date Submitted: ${date}
  
  Please review and take necessary action.
  `,
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: 'Failed to send email to hardware engineer' });
  }
  console.log('Email sent: ' + info.response);
});

    res.status(200).json({ message: 'Issue submitted successfully', issueNo: newIssueNo });
  } catch (err) {
    console.error('Error storing issue data:', err);
    res.status(500).json({ error: 'Failed to store issue' });
  }
});



router.get('/by-pin/:userPin', async (req, res) => {
  try {
    const { userPin } = req.params; // Get userPin from route parameter

    if (!userPin) {
      return res.status(400).json({ message: "User PIN is required" });
    }

    // SQL Injection Protection using parameterized queries
    await sql.connect(config);
    const request = new sql.Request();
    request.input('emp', sql.VarChar, userPin); // Use the userPin directly

    const result = await request.query(`
      SELECT t_asno, t_nama
      FROM ttxtvs1109001
      WHERE t_cusr = @emp
    `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "No assets found for this user pin" });
    }

    res.json(result.recordset); // Return the result as JSON

  } catch (err) {
    console.error("Error:", err.message); // Log the exact error
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});


router.get('/search', async (req, res) => {
  const { query } = req.query;

  try {
    // Connect to the database
    await sql.connect(config);

    // Create a new request
    const request = new sql.Request();

    // Add parameters for the query
    request.input('queryParam', sql.VarChar, `%${query}%`);

    // Execute the SQL query
    const result = await request.query(`
      SELECT t_emno, t_nama 
      FROM ttccom0019001 
      WHERE t_emno LIKE @queryParam OR t_nama LIKE @queryParam
    `);

    // Send the results back as JSON
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});
  
  module.exports = router;