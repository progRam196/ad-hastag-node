var config = {};

config.secret = 'adHaShTag';
config.docroot = '/home/ram/Workarea/Node/ad-hastag/';
config.currentDate = new Date();
config.currentTimestamp = config.currentDate.getTime();
config.baseurl = 'http://localhost:5000/';
config.colors=["Red","Blue","Green","Yellow","Orange","Purple","Brown","Black","Teal"];
//config.colors = ["#CD5C5C","#F08080","#FA8072","#E9967A","#FFA07A","#DC143C","#FF0000","#B22222","#8B0000","#FFC0CB","#FFB6C1","#FF69B4","#FF1493","#C71585","#DB7093","#FFA07A","#FF7F50","#FF6347","#FF4500","#FF8C00","#FFA500","#FFD700","#FFFF00","#FFFFE0","#FFFACD","#FAFAD2","#FFEFD5","#FFE4B5","#FFDAB9","#EEE8AA","#F0E68C","#BDB76B","#E6E6FA","#D8BFD8","#DDA0DD","#EE82EE","#DA70D6","#FF00FF","#FF00FF","#BA55D3","#9370DB","#663399","#8A2BE2","#9400D3","#8B008B","#800080","#4B0082","#6A5ACD","#483D8B","#7B68EE","#ADFF2F","#7FFF00","#7CFC00","#00FF00","#32CD32","#98FB98","#90EE90","#00FA9A","#00FF7F","#3CB371","#2E8B57","#228B22","#008000","#006400","#9ACD32"];

module.exports = config;
