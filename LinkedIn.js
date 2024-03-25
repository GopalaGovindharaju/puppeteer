import axios from 'axios';
import ExcelJS from 'xlsx';

const options = {
  method: 'GET',
  url: 'https://linkedin-profiles1.p.rapidapi.com/extract',
  params: {
    url: 'https://www.linkedin.com/in/triparnasamaddar/',
    html: '1'
  },
  headers: {
    'X-RapidAPI-Key': '3b8dad0975msha65b971ed8ac4b0p19475cjsne1f2bc96482a',
    'X-RapidAPI-Host': 'linkedin-profiles1.p.rapidapi.com'
  }
};

async function fetchData() {
  try {
    const response = await axios.request(options);
    const userData = response.data.extractor; // Accessing the 'extractor' object
    
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('LinkedIn Profile');

    worksheet.columns = [
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Job Title', key: 'jobTitle', width: 30 },
      { header: 'Location', key: 'location', width: 30 }
    ];

    worksheet.addRow({
      name: userData.name || '',
      jobTitle: userData.jobTitle ? userData.jobTitle.join(', ') : '',
      location: userData.address ? userData.address.addressLocality || '' : ''
    });

    // Write the workbook to a buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Send the buffer as a response
    return buffer;

  } catch (error) {
    console.error(error);
    return null;
  }
}

async function saveExcelFile() {
  try {
    const buffer = await fetchData();
    if (buffer) {
      // Write the buffer to a file
      require('fs').writeFileSync('linkedin_profile.xlsx', buffer);
      console.log('Data has been written to excel file successfully.');
    } else {
      console.log('Error occurred while fetching data.');
    }
  } catch (error) {
    console.error(error);
  }
}

saveExcelFile();
