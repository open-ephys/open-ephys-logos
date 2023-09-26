<script type="text/javascript" src="https://SITEURL/s/paper.js"></script>
<!-- Define inlined PaperScript associate it with myCanvas -->
<script type="text/paperscript" canvas="myCanvas">
	
var background = new Path.Rectangle(new Point(0, 0), new Size(200, 200));
background.fillColor = 'white';

var centers =[]; 
var freqphase=[]; 
var ncenters=6;
var text_top_px=129;

var lowest=0;

for (var i = 0; i < ncenters; i++) {
    centers.push([40+Math.random()*130,75+Math.random()*60]);
    if (centers[i][1]>lowest){ // align lowest point to text
    	lowest=centers[i][1];
    }
    freqphase.push([1+Math.random()*4,Math.random()*200,0]); // freq,phase,flag for collision detection
    if (Math.random()<0.5){
    freqphase[i][0]=-freqphase[i][0];
    }
}
// align lowest point to text
for (var i = 0; i < ncenters; i++) {
   centers[i][1] = text_top_px+centers[i][1]-lowest;

}


var centers_rot =centers; 


var drawornot = new Array(ncenters);
for (var i = 0; i < ncenters; i++) {
    drawornot[i] = new Array(ncenters);
}
for (var i = 0; i < ncenters; i++) {
    for (var j = 0; j < ncenters; j++) {
          drawornot[i][j]=0;
    }
}

for (var i = 0; i < ncenters; i++) {
	for (var j = 0; j < i; j++) {
	    if (i<4 & j<4) {
	        drawornot[i][j]=1;
	    }else{
	        if (Math.random()<0.25){
		    drawornot[i][j]=1;
	        }
	    }
	}
}

console.log(drawornot);

var N_in = new Array(ncenters);
for (var i = 0; i < ncenters; i++) {
    N_in[i]=0;
	for (var j = 0; j<ncenters; j++) {
		if ((drawornot[i][j]==1) | (drawornot[j][i]==1)){
            N_in[i]++;
		}
	}
}

//console.log(N_in);

for (var i = 0; i < ncenters; i++) {
	if (N_in[i]==1){
        var foundone=0;
        for (var j = 0; j<ncenters; j++) {
            //  drawornot[j][i]=3;
            if ((N_in[j]>0) & (j!=i)  & (drawornot[i][j]==0) & (drawornot[j][i]==0) & (foundone==0)){
               drawornot[i][j]=3;
               N_in[i]++; 
               foundone=1;
            }
        }
	}
}


var colors = [];
	colors.push('FBD126'); // yellow
	colors.push('24B7E1'); // light blue
	colors.push('24B7E1'); 
	colors.push('EA6A3F'); // pale red
	colors.push('B5B5B5'); // grey
	colors.push('B5B5B5');
	colors.push('B5B5B5');
	colors.push('D6AACD'); // pale violet
	//colors.push('7FC244'); // green
	colors.push('2FB6DF'); // blue

    
    

var connections = new Group();
function generateConnections(paths) {
    var cdraw=0;
    var ccolor=0;
	for (var i = 0; i < ncenters; i++) {
		for (var j = 0; j < ncenters; j++) {
                cdraw=cdraw+1;
                if (drawornot[i][j]>0){
                    ccolor=ccolor+1;
                    //var n=(i+j+Math.round(Math.random()*10))%7;  
                    var n=ccolor%9;
              
                    // Create a Paper.js Path to draw a line into it:
                    var path = new Path();
                    
                    path.strokeColor =  colors[n];

                    path.strokeWidth= 3;
                    path.strokeCap= 'round';
                    path.blendMode= 'multiply';
	
                    path.moveTo(centers[i]);
                    path.lineTo( centers[j]);
                    connections.appendTop(path);
                
		    }
		}
	}
}

generateConnections(centers);


function onFrame(event) {
if (event.count%10 == 0) {
  var tfactor  =1; // set to ~.1 for debug
for (var i = 0; i < ncenters; i++) {
    var dx=Math.sin(((1/tfactor)*0.01*event.time*freqphase[i][0])+freqphase[i][1]);
    var dy=Math.cos(((1/tfactor)*0.01*event.time*freqphase[i][0])+freqphase[i][1])*0.75;
    centers[i][0]+=dx/(tfactor*10);
    centers[i][1]+=dy/(tfactor*10);
 if( centers[i][0]>155){
    centers[i][0]=155;
}
 if( centers[i][1]>text_top_px){
   centers[i][1]=text_top_px;
 }
if( centers[i][1]>=text_top_px && freqphase[i][2]==0){ // reflect and set flag
    freqphase[i][0]=-freqphase[i][0];
    freqphase[i][2]=1;
}
 if( centers[i][1]<text_top_px-2){ //reset flag
freqphase[i][2]=0;
  }
 if( centers[i][0]<30){
    centers[i][0]=30;
}
 if( centers[i][1]<50){
    centers[i][1]=50;
}

}
    connections.children = [];
    generateConnections(centers);
}
}

</script>
