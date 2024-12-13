const express = require('express');
const sql = require('mssql');
const config = require('../dbconfig'); // Ensure this points to your DB configuration
const router = express.Router();
console.log('issue page');
router.get('/a/:emp', async (req, res) => { // Corrected
  const { emp } = req.params;
  console.log('Inside fetch asset', emp);
  if (!emp) {
      return res.status(400).send('Employee ID is required');
  }
  try {
      await sql.connect(config);
      const result = await sql
          .query(`SELECT t_asno ,t_nama FROM ttxtvs1109001 WHERE t_cusr = '${emp}'`);
      // console.log('Query Result:', result.recordset);
      res.json(result.recordset);
  } catch (err) {
      console.error('Error:', err.message);
      res.status(500).send('Error fetching asset IDs');
  }
});
router.get('/list_emp', async (req, res) => {
  const query = `
    SELECT DISTINCT e.t_emno as emp_id ,e.t_nama  as emp_name
    FROM ttccom0019001 e 
    RIGHT JOIN ttxtvs1159001 i ON i.t_emno = e.t_emno
  `;
  console.log('issue raised emp');
  try {
    await sql.connect(config);
    const result = await sql.query(query); 
    const employees = result.recordset; 
    console.log(employees);
    res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching employee names:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/updation/:id', async (req, res) => {
  const { id } = req.params; // Issue number (t_isno)
  const { t_ists, t_hcmt, t_cldt} = req.body; // Updated fields
  console.log(id);
  const query = `
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

    request.input('t_cldt', sql.DateTime, t_cldt|| null);
    request.input('id', sql.NVarChar, id);

    const result = await request.query(query);

    if (result.rowsAffected[0] > 0) {
      res.status(200).json({ message: 'Issue updated successfully!' });
    } else {
      res.status(404).json({ message: 'Issue not found!' });
    }
  } catch (error) {
    console.error('Error updating issue:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get("/list",async(req,res)=>{
  try{
    await sql.connect(config);
     const result=await
    sql.query(' SELECT i.t_isno,i.t_ists,i.t_isdt,i.t_idsc,i.t_asno,i.t_emno,i.t_hcmt,a.t_nama,e.t_nama as empname from ttxtvs1159001 i left join ttxtvs1109001 a on  i.t_asno = a.t_asno left join ttccom0019001 e on e.t_emno = a.t_cusr;')
    console.log('All the issues',result.recordset); 
    res.json(result.recordset);

    
  }
  catch(err)
  {
    console.error("Error:", err.message)
    res.status(500).send("Error fetching issues")
  }

})
router.put("/updation/:isno",async(req,res)=>{
  console.log(req.params);
})
// router.get('/a/:empId', (req, res) => {
//   const { empId } = req.params;
//   // Example logic: Query your database using the empId
//   console.log(`Fetching assets for employee ID: ${empId}`);
//   // Mocked database response
//   res.json([{ id: 'ASSET01', name: 'Laptop' }, { id: 'ASSET02', name: 'Printer' }]);
// });



router.get('/:emno', async (req, res) => {
    // console.log('inside');
    try {
        // Get emno from the URL parameter
        const { emno } = req.params;

        // Validate that emno is provided
        if (!emno) {
            return res.status(400).json({ error: 'Employee number (emno) is required' });
        }

        // Connect to the database
        await sql.connect(config);
//console.log('Issues page - fetching issues for emno:', emno);

        // Query to fetch issues based on emno
        const result = await sql.query(`
         SELECT 
    t_isno, 
    DATEADD(MINUTE, 330, t_isdt) AS t_isdt,  
    a.t_nama, 
    i.t_emno, 
    i.t_idsc, 
    i.t_ists, 
    i.t_hcmt
    
FROM ttxtvs1159001 i left join ttxtvs1109001 a
on i.t_asno = a.t_asno

WHERE t_emno = '${emno}'`
);

        console.log('Query result:', result.recordset);

        // Send the result as JSON response
        res.json(result.recordset);
    } catch (err) {
        console.error('Error fetching issues:', err);
        res.status(500).json({ error: 'Failed to fetch issues' });
    }
});

  
  
// Store Issue Data
router.post('/submit', async (req, res) => {
  const { t_isdt, t_asno, t_emno, t_idsc, t_ists, t_hcmt,t_cldt, t_Refcntd, t_Refcntu } = req.body;

  console.log('issues submission');
  await sql.connect(config);

  // Validate input
  if (!t_isdt || !t_asno || !t_emno || !t_idsc || !t_ists  || t_Refcntd === undefined || t_Refcntu === undefined) {
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

      // Step 5: Prepare and execute the insert query including all columns
      const queryString = `
          INSERT INTO ttxtvs1159001 (t_isno, t_isdt, t_asno, t_emno, t_idsc, t_ists, t_hcmt,t_cldt, t_Refcntd, t_Refcntu)
          VALUES (@t_isno, @t_isdt, @t_asno, @t_emno, @t_idsc, @t_ists, @t_hcmt, @t_cldt,@t_Refcntd, @t_Refcntu)
      `;
      console.log(queryString);
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

      const result = await request.query(queryString).catch(err => {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Failed to execute query' });
     });
           console.log('Issue data stored successfully');
      
      res.status(200).json({ message: 'Issue submitted successfully', issueNo: newIssueNo });
  } catch (err) {
      console.error('Error storing issue data:', err);
      res.status(500).json({ error: 'Failed to store issue' });
  }
});



  
  module.exports = router;