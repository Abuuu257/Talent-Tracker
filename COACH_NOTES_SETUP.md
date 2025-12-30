# Coach Notes Feature - Setup Instructions

## ✅ What's Been Done:
1. ✅ Database table `coach_notes` created
2. ✅ Backend API routes added to `backend/routes/coach.js`
3. ✅ Frontend code updated in `view-athlete.js` and `api.js`
4. ✅ HTML updated with save button in `view-athlete.html`

## 🔧 IMPORTANT: Restart Backend Server

**The backend server MUST be restarted for the new routes to work!**

### Steps to Restart:

1. **Stop the current backend server:**
   - Press `Ctrl+C` in the terminal running the backend
   - OR close the terminal window

2. **Start the backend server again:**
   ```bash
   cd backend
   node server.js
   ```
   
3. **Verify it's running:**
   - You should see: "Server running on port 3000"
   - Check: http://localhost:3000/api/coach (should not give 404)

## 🧪 Testing the Feature:

1. **Login as a coach**
2. **Go to "Discover Athletes"** page
3. **Click on any athlete** to view their dashboard
4. **Scroll down** to "Coach's Scouting Notes" section
5. **Type some notes** in the textarea
6. **Click "Save Note"** button
7. **Button should show:** "Saving..." → "Saved!"
8. **Refresh the page** → Notes should still be there!

## 🐛 If Still Getting "Failed to Save":

### Check Browser Console (F12):
Look for error messages that show:
- The exact API URL being called
- The HTTP status code (404, 500, etc.)
- The error message from the server

### Common Issues:

1. **Backend not running:**
   - Error: "Failed to fetch" or "Network error"
   - Solution: Start the backend server

2. **Backend not restarted:**
   - Error: "404 Not Found"
   - Solution: Restart the backend server

3. **Database connection issue:**
   - Error: "500 Internal Server Error"
   - Solution: Check backend console for MySQL errors

4. **CORS issue:**
   - Error: "CORS policy blocked"
   - Solution: Make sure you're accessing via http://localhost:5500 or Live Server

## 📝 API Endpoints:

- **Save Note:** `POST /api/coach/:coachId/note/:athleteId`
- **Get Note:** `GET /api/coach/:coachId/note/:athleteId`

## 🎯 Expected Behavior:

✅ Notes save to database
✅ Notes persist after refresh
✅ Each coach has separate notes for each athlete
✅ Button shows "Saving..." then "Saved!"
✅ Console logs show successful API calls
