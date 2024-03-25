const axios = require('axios');
const ExcelJS = require('exceljs');

const options = {
  method: 'GET',
  url: 'https://linkedin-profiles1.p.rapidapi.com/extract',
  params: {
    html: '1'
  },
  headers: {
    'X-RapidAPI-Key': '92354c0699msh96ecaf20031260bp15998ejsn959a8dd758f0',
    'X-RapidAPI-Host': 'linkedin-profiles1.p.rapidapi.com'
  }
};

async function fetchData(urls) {
  try {
    const profilesData = [];

    for (const url of urls) {
      const response = await axios.request({
        ...options,
        params: {
          ...options.params,
          url: url
        }
      });

      const userData = response.data.extractor; // Accessing the 'extractor' object

      profilesData.push({
        name: userData.name || '',
        jobTitle: userData.jobTitle ? userData.jobTitle.join(', ') : '',
        location: userData.address ? userData.address.addressLocality || '' : '',
        linkedinurl: url, // Include the LinkedIn URL
        userinteractioncount: userData.interactionStatistic ? userData.interactionStatistic.userInteractionCount || 0 : 0 // Include the User Interaction Count
      });
    }

    return profilesData;

  } catch (error) {
    console.error(error);
    return null;
  }
}

async function saveExcelFile(profilesData) {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('LinkedIn Profiles');

    worksheet.columns = [
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Job Title', key: 'jobTitle', width: 30 },
      { header: 'Location', key: 'location', width: 30 },
      { header: 'LinkedIn URL', key: 'linkedinurl', width: 60 }, // Add LinkedIn URL column
      { header: 'Followers', key: 'userinteractioncount', width: 30 } // Add User Interaction Count column
    ];

    for (const profileData of profilesData) {
      worksheet.addRow(profileData);
    }

    await workbook.xlsx.writeFile('linkedin_profiles_Data1.xlsx');
    console.log('Data has been written to excel file successfully.');

  } catch (error) {
    console.error(error);
  }
}

async function scrapeAndSave(urls) {
  try {
    const profilesData = await fetchData(urls);
    if (profilesData) {
      await saveExcelFile(profilesData);
    } else {
      console.log('Error occurred while fetching data.');
    }
  } catch (error) {
    console.error(error);
  }
}

const urls = [
  'https://www.linkedin.com/in/triparnasamaddar/',
  'https://www.linkedin.com/in/tej-hans-raj-singh-34462a6/',
  'https://www.linkedin.com/in/kapiljoshi78/',
  'https://www.linkedin.com/in/ruchi-ahluwalia-sphr-abbb81aa/',
  'https://www.linkedin.com/in/manoj-kulgod-0a374327/',
  'https://www.linkedin.com/in/raman-preet-sahi-78598b19/',
  'https://in.linkedin.com/in/pooja-agarwal-bba315136',
  'https://www.linkedin.com/in/kmunish/'
];

scrapeAndSave(urls);
