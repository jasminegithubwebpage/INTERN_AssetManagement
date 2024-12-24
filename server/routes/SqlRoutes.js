// routes/sqlRoutes.js
const express = require('express');
const sql = require('mssql');
const router = express.Router();
const config = require('../dbconfig'); // Importing the config file
// select a.*,

// e.t_emno emp_pin , e.t_nama emp_name ,d.t_dsca dept_name 
// from   ttxtvs1109001 a left join  ttccom0019001 e on a.t_cusr= e.t_emno
// left join ttcmcs0659001 d on e.t_cwoc  = d.t_cwoc
// SQL query route to get assets (No need to repeat /assets here)
// router.get('/',async(req,res)=>{
//     try{
//      await sql.connect(config);   
//     const {username,password}=req.body;
//     const result = await sql.query(`SELECT * FROM users where username = ${username} and password = ${password}`);
//     console.log(result);
//    if(result.recordset.length>0)
//    {
//      res.status(200).json({message:'Login Successfull',success:true});
//    }
//    else{
//     res.status(401).json({message:'Invalid username or password',success:false});
//     console.error('Error:', err);
//     res.status(500).json({ message: 'Internal Server Error', success: false });
//    }
//     }
//     catch(err)
//     {
//         console.log(err);
//     }
// })
router.get('/', async (req, res) => {  // This is now a simple GET request for '/assets'
    try {
        // Connect to the database using the config
        await sql.connect(config);
        
        // Query the database to fetch assets
        const result = await sql.query(`SELECT 
    a.t_asno,
    a.t_nama,a.t_catg,
    CASE 
        WHEN a.t_stat = 1 THEN 'Active'
        WHEN a.t_stat = 2 THEN 'Scrap'
        ELSE 'Unknown' -- Optional: handles cases where t_stat is neither 1 nor 2
    END AS t_stat,
    e.t_emno ,
    e.t_nama as emp_name,
    d.t_dsca 
FROM 
    ttxtvs1109001 a
LEFT JOIN 
    ttccom0019001 e ON a.t_cusr = e.t_emno
LEFT JOIN 
    ttcmcs0659001 d ON e.t_cwoc = d.t_cwoc;`);
        
     //  console.log('Results',result);
        // Send the result as JSON response
        res.json(result.recordset);
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});
router.get('/:asno', async (req, res) => {
    const { asno } = req.params; // Get the 'asno' from the URL parameter
   // console.log("from server", asno);
    try {
        await sql.connect(config);
        const result = await sql.query`SELECT * FROM ttxtvs1109001 WHERE t_asno = ${asno}`;
        //console.log("detail from db", result.recordset);
        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Asset not found' });
        }

        res.json(result.recordset[0]); // Send the first record as a response
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Failed to fetch asset' });
    }
});
// Route to fetch asset components by asset number (asno)
router.get('/:asno/components', async (req, res) => {
    const { asno } = req.params; // Get the 'asno' from the URL parameter
    //console.log('from components');
    try {
        await sql.connect(config);
        const result = await sql.query`
     SELECT 
        b.t_cmtn AS Asset_Name, 
        b.t_cmsz AS Upgrade_Size, 
        b.t_cmds AS Upgrade_Notes, 
        b.t_ctdt AS Transaction_Date
    FROM 
        ttxtvs1139001 a
    INNER JOIN 
        ttxtvs1149001 b
    ON 
        a.t_cmtn = b.t_cmtn;
`;

//console.log("Fetched Data:", result.rows);

     //   console.log("from backend componenet",result);
        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'No components found for this asset' });
        }
     
        res.json(result.recordset); // Send all components as a response
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Failed to fetch asset components' });
    }
});
router.get('/by-pin/:emp', async (req, res) => {
    const { emp } = req.params;
    
    try {
      // Connect to the database
      await sql.connect(config);
      
      // Query to get assets for the given employee (user pin)
      const request = new sql.Request();
      request.input('emp', sql.VarChar, emp); // Parameterized query to avoid SQL injection
      const result = await request.query(`
        SELECT t_asno, t_nama
        FROM ttxtvs1109001
        WHERE t_cusr = @emp
      `);
      
      // Send the result back as JSON
      res.json(result.recordset);
    } catch (error) {
      console.error('Error fetching assets:', error);
      res.status(500).json({ message: 'Failed to fetch assets' });
    }
  });
  

/// Route for Asset Movement Details
router.get('/:asno/movement', async (req, res) => {
    const assetNumber = req.params.asno;  // Get asset number from request params

    const query = `
   SELECT 
    am.[t_mvid] AS Movement_ID,
    FORMAT(am.[t_mvdt], 'yyyy-MM-dd') AS Transaction_Date,
    am.[t_asno] AS Asset_Number,
    e.[t_emno] AS Employee_No,
    e.[t_nama] AS Employee_Name,
    d.[t_dsca] AS Department_Description,
    am.[t_rmrk] AS Remarks
FROM 
    [dbo].[ttxtvs1169001] AS am
LEFT JOIN 
    [dbo].[ttccom0019001] AS e
ON 
    am.[t_emno] = e.[t_emno]
LEFT JOIN 
    [dbo].[ttcmcs0659001] AS d
ON 
    e.[t_cwoc] = d.[t_cwoc]
WHERE 
    am.[t_asno] = @assetNumber`;




    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('assetNumber', sql.NVarChar, assetNumber)  // Bind parameter correctly
            .query(query);
       // console.log("movement",result.recordset);
        res.json(result.recordset);  // Send the result as JSON to the client
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Error fetching movement details');
    }
});

router.get('/:asno/issues', async (req, res) => {
    const { asno } = req.params; // Get the 'asno' from the URL parameter
    console.log('issues');
    try {
        const pool = await sql.connect(config);
        const result = await pool.request() // Use .request() to bind parameters
            .input('asno', sql.NVarChar, asno) // Bind the 'asno' parameter
            .query(`
            SELECT 
                i.t_isno AS Issue_Log_No,
                 FORMAT(i.t_isdt, 'yyyy-MM-dd') AS Issue_Log_Date, 
                i.t_asno AS Asset_No,
                i.t_emno AS Employee_No,
                e.t_nama AS Employee_Name,
                i.t_idsc AS Issue_Description,
                i.t_ists AS Issue_Status,
                i.t_hcmt AS HW_Engineer_Comments
            FROM 
                ttxtvs1159001 as i
            LEFT JOIN 
                ttccom0019001  as e
            ON 
                i.t_emno = e.t_emno
            WHERE 
                i.t_asno = @asno;  
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'No issues found for this asset' });
        }

        res.json(result.recordset); // Send all issues as a response
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Failed to fetch asset issues' });
    }
});


module.exports = router;
