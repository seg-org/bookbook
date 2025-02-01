function SearchByDetail() {
    return (
        <>
        <form className="grid gap-2.5">
              <input className="p-2.5 border border-gray-300 rounded-sm" type="text" placeholder="ชื่อหนังสือ"></input>
              <input className="p-2.5 border border-gray-300 rounded-sm" type="text" placeholder="ผู้เขียน"></input>
              <input className="p-2.5 border border-gray-300 rounded-sm" type="text" placeholder="สำนักพิมพ์"></input>
              <input className="p-2.5 border border-gray-300 rounded-sm" type="text" placeholder="ISBN"></input>
        </form> 
        </>
    );
  }
  
  export default SearchByDetail;