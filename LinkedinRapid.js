import axios from 'axios';
import ExcelJS from 'exceljs';

async function writeToExcel(data) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Data');

  // Define column headers
  const headers = [
    'poster_linkedin_url',
    'post_url',
    'posted',
    'num_appreciations',
    'num_comments',
    'num_empathy',
    'num_interests',
    'num_likes',
    'num_praises',
    'num_reposts',
    'reshared',
    'text',
    
  ];
  worksheet.addRow(headers);

  // Populate rows with data
  data.forEach(obj => {
    const row = [];
    headers.forEach(header => {
      // Check if the header exists in the object, if not, push empty string
      row.push(obj.hasOwnProperty(header) ? obj[header] : '');
    });
    worksheet.addRow(row);
  });

  // Write data to Excel file
  await workbook.xlsx.writeFile('triparnasamaddar.xlsx');
  console.log('Excel file created successfully.');
}

const options = {
  method: 'GET',
  url: 'https://fresh-linkedin-profile-data.p.rapidapi.com/get-profile-posts',
  params: {
    linkedin_url: 'https://www.linkedin.com/in/triparnasamaddar/',
    type: 'posts'
  },
  headers: {
    'X-RapidAPI-Key': '3b8dad0975msha65b971ed8ac4b0p19475cjsne1f2bc96482a',
    'X-RapidAPI-Host': 'fresh-linkedin-profile-data.p.rapidapi.com'
  }
};

try {
  const response = await axios.request(options);
  console.log(response.data);
  const { data } = response.data; // Extracting the 'data' key from the response
  if (data && data.length > 0) {
    await writeToExcel(data);
  } else {
    console.log('No data fetched.');
  }
} catch (error) {
  console.error(error);
}
