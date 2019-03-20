sudo service nginx start
cd /home/administrator/work/WebServer/
pm2 start 'npm start' --name 'WebServer'
cd /home/administrator/work/DeviceServer/SmartAircokDeviceServer/
pm2 start npm -- start
