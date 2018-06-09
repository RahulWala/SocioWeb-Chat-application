# SocioWeb-Chat-application
Socioweb Chat app created using socket.io along with nodejs, mongodb, ejs.

[Click to go to application and chat](http://ec2-13-232-76-119.ap-south-1.compute.amazonaws.com)

steps to deploy and run and use the application
1) login to [aws.amazon.com](http://aws.amazon.com)
2) and create instance with new key pair and security setup 
	inside security choose custom TCP option and enter your port no(eg :- 8000) and choose anywhere
3) To work with your system and configure things in an instance 
	Install ssh in window(for ubuntu also)
	then go to aws.amazon.com.ec2 and choose your instance and click on connect
	Put downloaded keypair file at desktop 	
	for windows 
		in cmd(locate at desktop) run - "ssh -i "keypair_filename.pem" ubuntu@your_public_dns.amazonaws.com"
		
	You will enter into your system 
4) Install one by one nginx, nodejs, git, pm2  
	for eg:- sudo apt-get install nginx
	"One by One"
5) Clone your application using git clone "link_of_application"
6) go to ur file using 
	first write "ls"
	then "cd Your_File_Name"
7) Edit app.js or server.js file by writing "sudo nano pp.js"
8) For online databse use mLab 
	Go to [mLab](http://mlab.com)
	inside that click on User and create user with password
	and create databse and nothing else copy the link "mongodb://<dbuser>:<dbpassword>@ds147450.mlab.com:47450/socioweb"
	replace <dbuser> with username and <dbpassword> with password
	nd leave it as it is
9) Now go back to ubuntu system of amazon and inside app.js change dbPath with "mongodb://<dbuser>:<dbpassword>@ds147450.mlab.com:47450/socioweb"
10) go to app.listen('PORT_NO','public_IPV4');  public IPV4 u will find at dashboard of aws.amazon.com/ec2 - ip address 
	Save it and exit
11) then Write "cd"
12) Now write "cd /etc/nginx/" hit enter
13) Then write "sudo rm sites-available/default"
14) after that "sudo vi sites-available/default"
	and press "i" to write in file
15) copy and paste below code
	server {
	    	listen 80;
    		server_name your_public_dns.amazonaws.com;
    		location / {
        		proxy_pass http://private_ipv4_address:YOUR_PORT_NUMBER;
       			proxy_http_version 1.1;
        		proxy_set_header Upgrade $http_upgrade;
        		proxy_set_header Connection 'upgrade';
        		proxy_set_header Host $host;
        		proxy_cache_bypass $http_upgrade;
     		}
	} 
	
	press esc and press"shift + :" and then write "x" hit enter
16) now write "sudo service nginx reload" and then "sudo service nginx restart"
17) Go back to your application folder by typing below commands
	cd
	cd YOUR_FILE_NAME
18) Now type "pm2 start app.js" to host your application to your public dns name
19) to stop hosting write  "pm2 stop app.js"
20) Go to browser and type public dns of your instance and voila!!!! you have deploy application at amazon webservice!!!!
