import puppeteer from "puppeteer";
import axios from "axios";
import readline from 'readline';

const apiOptions = {
  method: 'POST',
  url: 'https://fresh-linkedin-profile-data.p.rapidapi.com/search-companies',
  headers: {
    'content-type': 'application/json',
    'X-RapidAPI-Key': '3b8dad0975msha65b971ed8ac4b0p19475cjsne1f2bc96482a',
    'X-RapidAPI-Host': 'fresh-linkedin-profile-data.p.rapidapi.com'
  },
  data: {
    company_headcounts: [
      '1001-5000',
      '5001-10000'
    ],
    company_headcount_growth: {min: -10, max: 10},
    headquarters_location: [103644278],
    industry_codes: [3, 4],
    hiring_on_linkedin: 'false',
    recent_activities: [],
    keywords: '',
    limit: 1 // Limiting to 1 result as we only need one company's data
  }
};

async function getCompanyGeocode() {
  // Create readline interface
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  // Prompt user for company name
  const companyName = await new Promise((resolve) => {
    rl.question('Enter the company name: ', (answer) => {
      resolve(answer);
    });
  });

  rl.close();

  return companyName;
}

async function fetchCompanyData(companyName) {
  try {
    // Update the API data with the entered company name
    const options = { method: 'POST',
    url: 'https://fresh-linkedin-profile-data.p.rapidapi.com/search-companies',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': '3b8dad0975msha65b971ed8ac4b0p19475cjsne1f2bc96482a',
      'X-RapidAPI-Host': 'fresh-linkedin-profile-data.p.rapidapi.com'
    },
    data: {
      company_headcounts: [
        '1001-5000',
        '5001-10000'
      ],
      company_headcount_growth: {min: -10, max: 10},
      headquarters_location: [103644278],
      industry_codes: [3, 4],
      hiring_on_linkedin: 'false',
      recent_activities: [],
      keywords: '',
      limit: 1 // Limiting to 1 result as we only need one company's data
    } };
    options.data.keywords = companyName;

    // Fetch data from API
    const response = await axios.request(options);
    const companyData = response.data[0]; // Assuming the first result is the desired company

    // Extract and return the geocode (headquarters location)
    return companyData.geocode;
  } catch (error) {
    console.error('Error:', error);
  }
}

// Usage
(async () => {
  const companyName = await getCompanyGeocode();
  const geocode = await fetchCompanyData(companyName);
  console.log('Geocode (Headquarters Location):', geocode);
})();
