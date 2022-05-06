class CoolTab extends HTMLElement{
    constructor(){
        super(); 
        const shadow = this.attachShadow({mode: 'open'}); 

        this.shadowRoot.innerHTML = `
            <style>

                @import url("./src/cool-tabs-css.css"); 
            
            </style>
            <div class="cooltabs" part="cool-tab">
                <slot name="tabs"></slot>
            </div>
            <slot>
            </slot>
        `   
    }

    #select; 
    #type; 
    #orientation =this.getAttribute('orientation'); 
    #side = this.getAttribute('side'); 
    
    get select() {
        return this.getAttribute('select');
    }
    
    set select(newValue) {
        this.setAttribute('select', newValue);
    }

    get orientation() {
        return this.getAttribute('orientation');
    }
    
    set orientation(newValue) {
        this.setAttribute('orientation', newValue);
    }

    get side() {
        return this.getAttribute('side');
    }
    
    set side(newValue) {
        this.setAttribute('side', newValue);
    }

    get type() {
        return this.getAttribute('type');
    }
    
    set type(newValue) {
        this.setAttribute('type', newValue);
    }


    static get observedAttributes() { return ["select","type","side","orientation"] }

    attributeChangedCallback(name, oldValue, newValue){
        if(name === "select"){
            this.#select = newValue; 
        }
        if(name === "type"){
            this.#type = newValue; 
        }
        if(name === "side"){
            this.#side = newValue; 
        }
        if(name === "orientation"){
            this.#orientation = newValue; 
        }
        this.#renderTabs();  
    }    

    connectedCallback(){
        if(!this.hasAttribute("type") || !["plain","underline","block"].includes(this.getAttribute("type"))){
            this.setAttribute("type","plain"); 
        }
        this.#renderTabs(); 
    }

    #renderTabs(){
        if(!this.hasAttribute("type") || !["plain","underline","block"].includes(this.getAttribute("type"))){
            this.setAttribute("type","plain"); 
        }
        this.shadowRoot.firstElementChild.nextElementSibling.setAttribute("class","cooltabs");
        
        let thisChildren = Array.from(this.children);  

        thisChildren.forEach(child=>{ 
            child.setAttribute("type",this.#type); 
            child.removeAttribute("selected"); 
        })

        let childToSelect = thisChildren.filter(child=>{
            return child.getAttribute('value') === this.#select &&!child.hasAttribute("frozen")
        });  

        if (childToSelect[0]!= undefined){
            childToSelect[0].setAttribute("selected",''); 
        }
        
        this.shadowRoot.firstElementChild.nextElementSibling.classList.add(this.#orientation); 
        this.shadowRoot.firstElementChild.nextElementSibling.classList.add(this.#side);

    }
}

class CoolTabItem extends HTMLElement{
    constructor(){
        
        super(); 
        this.setAttribute("slot","tabs"); 
        const shadow = this.attachShadow({mode: 'open'}); 
        this.shadowRoot.innerHTML =`
            <style>
                @import url("./src/cool-tabs-css.css"); 
            </style>
            <div class="tabwrapper" part="tab-item">
                <div class="tablabelwrapper" ><slot></slot></div>
            </div>
        `
        
    }
    #value = this.getAttribute('value'); 
    #selected = this.getAttribute("live"); 
    #type = this.getAttribute('type'); 
    #frozen = this.getAttribute('frozen'); 

    get value() {
        return this.getAttribute('value');
    }
    
    set value(newValue) {
        this.setAttribute('value', newValue);
    }

    get live(){
        return this.getAttribute("live"); 
    }
    set live(newValue){
        this.setAttribute("live",newValue); 
        
    }

    get frozen() {
        return this.getAttribute('frozen');
    }
    set frozen(newValue) {
        this.setAttribute('frozen', newValue);
    }

    static get observedAttributes() { return ["selected","type",'frozen'] }

    attributeChangedCallback(name, oldValue, newValue){
        if(name === "selected"){
            this.#selected = newValue; 
        }
        if(name === "type"){
            this.#type = newValue; 
        }
        if(name==="frozen"){
            this.#frozen = newValue; 
            if(newValue){
                this.addEventListener("click",this.#selectTab); 
            }
        }

        this.#renderTab(); 
    }  
    
    connectedCallback(){
 

        if(this.hasAttribute('live')){
            this.parentElement.setAttribute("select",this.value); 
            this.#selected = true; 
        }
        if(!this.hasAttribute('frozen')){
            this.addEventListener("click",this.#selectTab)
        }
       
        this.#renderTab(); 
        
    }

    #renderTab(){
        this.shadowRoot.lastElementChild.setAttribute("class","tabwrapper"); 

        if(this.hasAttribute('selected')){
            this.shadowRoot.lastElementChild.classList.add("selected"); 
           
        }else{
            this.shadowRoot.lastElementChild.classList.remove("selected"); 
        }

        if (this.hasAttribute('frozen')){
            this.shadowRoot.lastElementChild.classList.add("frozen"); 
        }else{
            this.shadowRoot.lastElementChild.classList.remove("frozen");
        }

        if(this.hasAttribute("type")){
            this.shadowRoot.lastElementChild.classList.add(this.#type); 
        }
        
    }
    #selectTab(evt){
        let coolTabSelection = new CustomEvent('coolTabSelection'); 
        this.dispatchEvent(coolTabSelection);
        this.parentElement.setAttribute("select",this.value); 
    }
}

class CoolTabContent extends HTMLElement{
    constructor(){
        super(); 
        const shadow = this.attachShadow({mode: 'open'}); 
        this.shadowRoot.innerHTML=`
        <style>
        
           @import url("./src/cool-tabs-css.css"); 
        </style>
        <div part="tab-content"><slot></slot></div>
        `
    }
    #value; 
    get value() {
        return this.getAttribute('value');
    }
    set value(newValue) {
        this.setAttribute('value', newValue);
    }
    static get observedAttributes() { return ['value'] }

    attributeChangedCallback(name, oldValue, newValue){
        if(name === "value"){
            this.#value = newValue; 
        }
        this.#renderContent(); 
    }  

    connectedCallback(){
        this.#renderContent();
        let me = this; 
        const observerParent = new MutationObserver(mutations=>{
            mutations.forEach(function(mutation) {
                if (mutation.type === "attributes") {
                    me.#renderContent(); 
                }
            }); 
        });
     
        observerParent.observe(this.parentElement, {
            attributes: true //configure it to listen to attribute changes
        });
        
    }
    #renderContent(){
        this.shadowRoot.lastElementChild.setAttribute("class","");
        this.shadowRoot.lastElementChild.classList.add(this.parentElement.getAttribute("side")+'side');
      
        if(this.parentElement.getAttribute("select")!=this.#value){
            this.shadowRoot.lastElementChild.classList.add("hidden"); 
        }else{
            this.shadowRoot.lastElementChild.classList.remove("hidden"); 
        }
    }
}


customElements.define('cool-tab',CoolTab); 
customElements.define('cool-tab-item',CoolTabItem); 
customElements.define('cool-tab-content',CoolTabContent); 
