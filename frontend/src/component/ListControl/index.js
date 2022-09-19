
export default function ListControl ( {altChildren, children, elements}){
    if(!elements) return altChildren
    if(elements && elements.length > 0){
        return children
    }else{
        return altChildren        
    }  
}