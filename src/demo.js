

document.addEventListener("click",evt=>{
    console.log("hey")
    let buttons = Array.from(document.getElementsByName("types"));
    console.log(buttons);

    buttons.forEach(button=>{
        console.log(button.checked); 
        if(button.checked){
         let cooltab = document.getElementById("tabs_to_change"); 
         cooltab.setAttribute("type",button.value); 
         let codeblock = document.getElementById("code"); 
         codeblock.innerHTML = `
HTML: 

&lt;cool-tab <span>type="${button.value}" select="2" </span>&gt;
    &lt;cool-tab-item value="1"&gt;
        Tab 1
    &lt;/cool-tab-item&gt;
    &lt;cool-tab-item value="2"&gt;
        Tab 2
    &lt;/cool-tab-item&gt;
    &lt;cool-tab-item value="3" <span>frozen</span>&gt;
        Tab 3
    &lt;/cool-tab-item&gt;
    &lt;cool-tab-content value="1"&gt;
        Cool Content 1
    &lt;/cool-tab-content&gt;
    &lt;cool-tab-content value="2"&gt;
        Cool Content 2
    &lt;/cool-tab-content&gt;
    &lt;cool-tab-content value="3"&gt;
        Cool Content 3
    &lt;/cool-tab-content&gt;
&lt;/cool-tab&gt;
         
         `
        }
    }); 

}); 
