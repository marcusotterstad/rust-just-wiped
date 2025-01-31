## **Project: Rust Server Wipe Tracker Bot**  

### **Overview**  
Create a **Discord bot** that tracks **Rust server wipe schedules** from **BattleMetrics** and sends **reminders** before a wipe happens. The bot should allow users to add servers via Discord messages and handle multiple servers at once.  

---

### **Features**  

#### **1️⃣ Discord Bot**  
- Users can track a **Rust server’s wipe schedule** by sending a **BattleMetrics link** in Discord.  
- The bot **saves the server** and its upcoming wipe time.  
- Sends **reminders** before a wipe (e.g., `24 hours`, `4 hours` before).  

#### **2️⃣ Web Scraper**  
- Fetches **wipe schedules** from **BattleMetrics** using web scraping.  
- Extracts **upcoming wipe dates** from the server’s page.  
- Updates stored wipe times if they change.  

#### **3️⃣ API Backend (SvelteKit)**  
- Provides an **API endpoint** for retrieving **wipe schedules**.  
- Handles scraping logic and returns wipe times.  
- Can be queried by the Discord bot.  

#### **4️⃣ Drizzle sqlite database **  
- Stores **tracked servers** and their **wipe times**.  
- Ensures data is not lost when the bot restarts.  
- Updates wipe times periodically.  

---

### **User Flow**  
1. User sends `!track <BattleMetrics URL>` in Discord.  
2. The bot extracts the **server ID** from the URL.  
3. The bot queries the **API backend** to fetch the **wipe schedule**.  
4. The bot **saves the wipe time** and schedules reminders.  
5. Before the wipe, the bot sends a **message** in Discord.  

---

### **Reminders & Notifications**  
- **24 hours before wipe:**  
  - `"🔥 Rustoria Solo/Duo/Trio is wiping in 24 hours!"`  
- **4 hours before wipe:**  
  - `"⚠️ Rustoria Solo/Duo/Trio is wiping in 4 hours!"`  
