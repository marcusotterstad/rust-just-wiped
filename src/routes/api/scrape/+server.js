import { json } from '@sveltejs/kit';
import { chromium } from 'playwright';

export async function GET({ url }) {
  const battlemetricsId = url.searchParams.get('id');
  
  if (!battlemetricsId) {
    return json({ error: 'Missing server ID' }, { status: 400 });
  }

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    await page.goto(`https://battlemetrics.com/servers/rust/${battlemetricsId}`, {
      waitUntil: 'networkidle'
    });
    
    await page.waitForSelector('div:has-text("Upcoming Wipes")', { 
      state: 'visible', 
      timeout: 60000 
    });
    
    const { serverName, wipeSchedules } = await page.evaluate(() => {
      const serverName = document.querySelector('h2').textContent.trim();
      
      const wipesDiv = Array.from(document.querySelectorAll('div'))
        .find(div => div.textContent.includes('Upcoming Wipes'));
        
      if (!wipesDiv) return { serverName, wipeSchedules: [] };
      
      const wipeSchedules = Array.from(wipesDiv.querySelectorAll('li'))
        .map(li => li.textContent.trim())
        .map(line => {
          // Remove the number prefix and clean up the string
          const cleanLine = line.replace(/^\d+\.\s*/, '');
          const matches = cleanLine.match(/Full - (\d{2}\/\d{2}\/\d{4}) (\d{1,2}):(\d{2}) ([AP]M) - in (\d+) days/);
          if (!matches) return null;
          
          const [_, dateStr, hours, minutes, ampm, inDays] = matches;
          const [month, day, year] = dateStr.split('/');
          
          let hour = parseInt(hours);
          if (ampm === 'PM' && hour !== 12) hour += 12;
          if (ampm === 'AM' && hour === 12) hour = 0;
          
          const date = new Date(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day),
            hour,
            parseInt(minutes)
          );
          
          return {
            type: 'Full',
            datetime: date.toISOString(),
            inDays: parseInt(inDays)
          };
        })
        .filter(Boolean);

      return { serverName, wipeSchedules };
    });

    await browser.close();
    return json({ serverName, wipes: wipeSchedules });
    
  } catch (error) {
    console.error('Scraping error:', error);
    await browser.close();
    return json({ error: 'Failed to fetch server data', details: error.message }, { status: 500 });
  }
}
