function SearchByDetail() {
    return (
        <>
        <form className="advanced-search">
              <input type="text" placeholder="ชื่อหนังสือ"></input>
              <input type="text" placeholder="ผู้เขียน"></input>
              <input type="text" placeholder="สำนักพิมพ์"></input>
              <input type="text" placeholder="ISBN"></input>
        </form> 
        </>
    );
  }
  
  export default SearchByDetail;