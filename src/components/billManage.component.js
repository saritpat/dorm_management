import { DatePicker,Space } from "antd";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import {useState, useEffect} from 'react';
import { listBills } from "./function.components/billmana";

import moment from "moment";

import { useNavigate } from "react-router-dom";


function Billmanage(){
    const { user } = useSelector((state) => ({...state}))
    const [data, setData] = useState([]);
    const [posts,setPosts] = useState([]);
    const [postDate,setPostDate] = useState('xxx')
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostPerPage] = useState(9);
    const [searchText,setSearchText]=useState('');

  const navigate = useNavigate();

    
    
    const loadData = (authtoken) => {
            listBills(authtoken)
            .then(res => {
                    setData(res.data)
                    setPosts(res.data);
                })
                .catch(err => {
                        console.log(err);
                    })
                };
    useEffect(()=> {
        setLoading(true)
        loadData(user.token)
        setLoading(false)
    }, []);
    const fillteredPosts = posts.filter((post)=>{       
        return post.roomId.includes(searchText);
      })
   
        
    if(loading){
        return <h2>loading...</h2>
    }
    const handlePageClick = (data)=>{
        console.log(data.selected)
        setCurrentPage(data.selected + 1)
    };
    var notPayed = data.filter(post => post.isPayed == false)
    var payed = data.filter(post => post.isPayed == true)


    function showAll() {
      setPosts(data)
    }

    function showNotPayed() {
      setPosts(notPayed)
    }
    function showPayed(){
      setPosts(payed)
    }
    async function fillterDate(date){
      await setPostDate(date)
      console.log(date+' and '+postDate)    
      let fillteredPostDate = data.filter((post)=>{ 
        return moment(post.createdAt).format("MMM YY") === date
      })
      setPosts(fillteredPostDate)
    }
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = fillteredPosts.slice(indexOfFirstPost,indexOfLastPost);
                
    return (
                    <div>
          <div className="content-wrapper font-sarabun">
            {/* Content Header (Page header) */}
            <div className="content-header">
              <div className="container-fluid">
                <div className="row mb-2">
                  {/* /.col */}
                  <div className="col-sm-12">
                    <ol className="breadcrumb float-sm-right">
                      <li className="breadcrumb-item">
                        <a href="#">จัดการบิล</a>
                      </li>
                      <li className="breadcrumb-item active">ระบบจัดการหอพัก</li>
                    </ol>
                  </div>
                  <div className="col-sm-12">
                    <div className="card" style={{margin: "auto",padding: "10px 100px 10px 100px", width: "60%", textAlign: "center"}}>
                        <h1 className="m-0 text-dark">เลือกรอบบิล {postDate}</h1>
                        <Space direction="vertical" style={{margin: "20px 0px 20px 0px"}}>
                            <DatePicker picker="month" onChange={(date)=>fillterDate(moment(date).format("MMM YY"))}/>
                        </Space>
                    </div>
                  </div>
                  {/* /.col */}
                </div>
                {/* /.row */}
              </div>
              {/* /.container-fluid */}
            </div>
            {/* /.content-header */}
            {/* Main content */}
            <section className="content">
              {/* /.container-fluid */}
              <nav class="navbar navbar-light bg-light">
                <form class="form-inline">
                    <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" value={searchText}
                onChange={(event)=>{setSearchText(event.target.value)}}/>
                    <button type="button" class="btn btn-outline-success my-2 my-sm-0 m-2" onClick={showAll}>แสดงทั้งหมด</button>
                    <button type="button" class="btn btn-outline-danger m-2" onClick={showNotPayed}>ยังไม่จ่าย</button>
                    <button type="button" class="btn btn-outline-primary m-2" onClick={showPayed}>จ่ายแล้ว</button>
                </form>
            </nav>
                
            <div className="row m-2">
             {
            currentPosts.map(post =>{
              return <div className="col-sm-6 col-md-4 v my-2">
                <div className="card shadow-sm w-100 " style={{ minHeight:175}}>
                <div className="card-header">
                    <h5 className="catd-title text-center h3 mt-2">
                        {post.isPayed === true ? "🟢" : "🔴"} ห้องพัก {post.roomId}
                      </h5>
                    </div>
                <div className="card-body">
                    <h6 className="catd-title text-center h2">{moment(post.createdAt).format('MMM')}</h6>
                    <h5 className="catd-subtitle mb-2 text-muted text-center">{post.rentalFee} บาท</h5>
                    <div className="d-flex justify-content-center">
                    <button type="button" class="btn btn-success text-center m-4" onClick={() => navigate('/roomdetail/' + post._id)}>ดูรายละเอียดของห้อง {post.roomName}</button>
                    
                </div>
                </div>
                </div>
                </div>
            }
            )
            }
            </div>
            <ReactPaginate
            onPageChange={handlePageClick}
            pageCount={fillteredPosts.length/postsPerPage}
            previousLabel={'<<'}
            nextLabel={'>>'}
            containerClassName={'pagination justify-content-center'}
            pageClassName={'page-item'}
            pageLinkClassName={'page-link'}
            previousClassName={'page-item'}
            previousLinkClassName={'page-link'}
            nextClassName={'page-item'}
            nextLinkClassName={'page-link'}
            breakClassName={'paeg-item'}
            breakLinkClassName={'page-link'}
            activeClassName={'active'}
            />

                



            </section>
            {/* /.content */}
          </div>
        </div>
    )
}
export default Billmanage;