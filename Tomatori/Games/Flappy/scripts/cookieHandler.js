/*
 *
 *	Various Test and functions to handle user Cookies
 *	Currently Assumes:
 *	- Main Website saves the cookies and pass these cookies
 *	  to the Game Site, so they handle it
 *	So if they main Website don't give us the info, this file is 
 *	borderline useless.
 *	
 *	Need to Implement
 *		- Error Check
 *		- ID Check
 */ 

class cookieHandler{

	constructor(){
		// Since we recieve cookies info in full strings
		// split it into array of key value pairs for easier access
		//
		this.cookies =  
			document.cookie
				.split(";")
				.map(cookie => cookie.split("="))
				.reduce((accumulator,[key,value]) => ({
					...accumulator,[key.trim()]: decodeURIComponent(value) 
			}),{});
    console.log(this.cookies.access_token);
    console.log(this.cookies.refresh_token);

    this.lifeTracker = 0;
	}

	// Access Function for tomatoCount and subtracting Tomato Count
	// Might need make this async so that game don't have to wait
	
   async getPom() { 
        
        const res = await fetch (`https://higgsboson2021.tobiky.repl.co/api/user/${this.cookies.access_token}/pomodoro`,{
          method: 'GET',
          headers: {
            'Authorization':'Bearer PYDBdFllFDZ6jEKhVrizOXTJVNnBKTuDDCyCr5hcpOI'}
        });

        if (!res.ok) {
          const message = `An error has occured: ${res.status}`;
          throw new Error(message); 
        }
        const data = await res.json();
        console.log(data);
        return data.pomodoro_points;
    }

    async incrementPom(amount) { 

        const res = await fetch (`https://higgsboson2021.tobiky.repl.co/api/user/${this.cookies.access_token}/pomodoro/increment/${amount}`,{
          headers: {
            'Authorization': 'Bearer PYDBdFllFDZ6jEKhVrizOXTJVNnBKTuDDCyCr5hcpOI'}
        });
        
        if (!res.ok) {
            const message = `An error has occured: ${res.status}`;
            throw new Error(message);
          }
        
        const data = await res.json();
        return data.pomodoro_points;
    }

    async decrementPom(amount) { 

        const res = await fetch (`https://higgsboson2021.tobiky.repl.co/api/user/${this.cookies.access_token}/pomodoro/decrement/${amount}`,{
          headers: {
            'Authorization': 'Bearer PYDBdFllFDZ6jEKhVrizOXTJVNnBKTuDDCyCr5hcpOI'}
        });
        
        if (!res.ok) {
            const message = `An error has occured: ${res.status}`;
            throw new Error(message);
          }
        
        const data = await res.json();
        return data.pomodoro_points;
    }

     async highScore(amount) { 
       
        
         const res = await fetch (`https://higgsboson2021.tobiky.repl.co/api/user/${this.cookies.access_token}/highscore/tomatori/${amount}`, { 
          method: 'PUT',
          headers: {
            'Authorization': 'Bearer PYDBdFllFDZ6jEKhVrizOXTJVNnBKTuDDCyCr5hcpOI'}
          });
        
          if (res.ok) {
            return;
          }
          else if (res.status >= 400) {

            const resPost = await fetch (`https://higgsboson2021.tobiky.repl.co/api/user/${this.cookies.access_token}/highscore/tomatori/`, { 
            method: 'POST',
            headers: {
            'Authorization': 'Bearer PYDBdFllFDZ6jEKhVrizOXTJVNnBKTuDDCyCr5hcpOI'},
            body: JSON.stringify({ highscore: amount })
          });

          if (!resPost.ok) {
            const message = `An error has occured: ${res.status}`;
            throw new Error(message);
          }
            return;
          }
        
     }
  

}
