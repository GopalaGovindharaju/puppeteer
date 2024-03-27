import axios from 'axios';
import ExcelJS from 'exceljs';

async function writeToExcel(data, sheetName, worksheet) {
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

  // Add column headers to the worksheet
  worksheet.addRow(headers);

  // Populate rows with data
  data.forEach(item => {
    const row = headers.map(header => item.hasOwnProperty(header) ? item[header] : '');
    worksheet.addRow(row);
  });

  console.log(`Posts for ${sheetName} appended successfully.`);
}

async function fetchDataAndWriteToExcel(url, sheetName, workbook) {
  const worksheet = workbook.addWorksheet(sheetName);

  const options = {
    method: 'GET',
    url: 'https://fresh-linkedin-profile-data.p.rapidapi.com/get-profile-posts',
    params: {
      linkedin_url: url,
      type: 'posts'
    },
    headers: {
      'X-RapidAPI-Key': 'f0c374687bmsh7a2f1baaaf26d80p1c4cf3jsn7594321871fe',
      'X-RapidAPI-Host': 'fresh-linkedin-profile-data.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    const { data } = response.data;
    if (data && data.length > 0) {
      await writeToExcel(data, sheetName, worksheet);
    } else {
      console.log(`No data fetched for ${sheetName}.`);
    }
  } catch (error) {
    console.error(error);
  }
}

async function scrapeLinkedInProfiles(profiles) {
  const workbook = new ExcelJS.Workbook();

  const promises = profiles.map(({ url, sheetName }) => fetchDataAndWriteToExcel(url, sheetName, workbook));
  
  await Promise.all(promises);

  // Write all data to Excel file
  await workbook.xlsx.writeFile('Quesscorp-Linkedin.xlsx');
  console.log('All posts appended to Excel file.');
}

// List of LinkedIn profile URLs and corresponding sheet names
const profiles = [
  { url: 'https://www.linkedin.com/in/triparnasamaddar/', sheetName: 'TriparnaSamaddar' },
  { url: 'https://linkedin.com/in/tej-hans-raj-singh-34462a6', sheetName:'Tej Hans Raj Singh'},
  {url: 'https://linkedin.com/in/kapiljoshi78', sheetName:'Kapil Joshi'},
  {url: 'https://linkedin.com/in/ruchi-ahluwalia-sphr-abbb81aa', sheetName:'RUCHI AHLUWALIA , SPHR'},
  {url: 'https://linkedin.com/in/manoj-kulgod-0a374327', sheetName:'Manoj Kulgod'},
  {url: 'https://linkedin.com/in/raman-preet-sahi-78598b19', sheetName:'Raman Preet Sahi'},
  {url: 'https://linkedin.com/in/pooja-agarwal-268626117', sheetName:'Pooja Agarwal'},
  {url: 'https://linkedin.com/in/kmunish', sheetName:'Munish Kumar'},
];

// Scrape LinkedIn profiles and append posts to Excel
scrapeLinkedInProfiles(profiles);
