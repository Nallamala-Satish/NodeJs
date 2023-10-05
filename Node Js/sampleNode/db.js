const sql= require('mysql2')
const con = sql.createConnection(
    {
        host:'localhost',
        user:'root',
        password:'dhanush',
        database:'node'
    }
)

function getUsers(id){
    console.log(id)
    return new Promise(function(Success,reject){     
        if(id){
            con.query(`SELECT * FROM user WHERE id=?`,[id],function(err,res){
                if(err){
                   reject(500)
                }else{
                    Success(res)
                }
            })
        }else{
        con.query(`SELECT * FROM user`,function(err,res){
            if(err){
               reject(500)
            }else{
                Success(res)
            }
        })
    }
    }) 
}

function addUsers(a,b,c,d){
    return new Promise(function(Success,reject){
        con.query(`INSERT INTO user (name,age,city,email)  VALUES(?,?,?,?)`,[a,b,c,d],function(err,res){
            if(err){
              reject(500)
            }else{
               Success(res)
            }
        })
    })  
}

function updateUsers(a,b,c,d,id){
    return new Promise (function(Success,reject){
        con.query(`UPDATE  user SET name=?,age=?,city=?,email=? WHERE id=?`,[a,b,c,d,id],function(err,res){
            if(err){
              reject(500)
            }else{
             Success(res)
            }
        })
    })
}
function deleteUsers(id){
    // console.log(id)
    return new Promise(function(Success,reject){
        getUsers(id)
        .then((user)=>{
            if(user.length > 0){
                con.query(`DELETE FROM user WHERE id=?`,[id],function(err,res){
                    if(err){
                        reject(500)
                    }else{
                       Success(res)
                    }
                })
            }else{
                reject(404)
            }
        })
       
    }) 
   
}

module.exports={
    getUsers,addUsers,updateUsers,deleteUsers,
}