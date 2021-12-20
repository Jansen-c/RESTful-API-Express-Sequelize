const express = require("express")

const {sequelize, hewan} = require('./models')
const HEWAN_MODEL = require('./models').hewan

const app = express();
app.use(express.json())

app.get("/ping", (req, res) => {
    const ready = {
        ready: true,
        timestamp: Date.now().toString()
    }

    res.status(200).send(ready)
})

app.get("/hewan", async (req, res) => {
     await HEWAN_MODEL.findAll().then(result =>{
        res.status(200).json(result)
    }).catch(error =>{
        res.status(500).json({
            message:  error
        })
    })
})

app.get("/hewan/:id", async (req, res) =>{
    const id = req.params.id
    await HEWAN_MODEL.findOne({
        where : {
            id : id
        }
    }).then(result =>{
        if(result){
            res.status(200).json(result)
        }else{
            res.status(404).json({
                message : "Hewan not found"
            })
        }
    }).catch(error =>{
        res.status(500).json({
            message:  error
        })
    })
})

app.post("/hewan", async (req,res) =>{
    const body = req.body
    console.log(req.body,"===================", body["nama"]);

    const newData = {
        nama : body['nama'], 
        namaSpesies: body['namaSpesies'],
        umur:body['umur']
    }

    await HEWAN_MODEL.create(
        newData
    ).then(result =>{
        res.status(201).json(result)
    }).catch(error =>{
        res.status(500).json({
           message:  error
        })
    })

})

app.patch("/hewan/:id", async (req,res) =>{
    const id = req.params.id
    const body = req.body

    const newData = {
        nama : body['nama'], 
        namaSpesies: body['namaSpesies'],
        umur:body['umur']
    }

    await HEWAN_MODEL.update(newData,{
        where : {
            id : id
        }
    }).then(
        res.status(200).json(newData)
    ).catch(error =>{
        res.status(500).json({
            message:  error
        })
    })
})

app.delete("/hewan/:id", async (req,res) =>{
    const id = req.params.id

    await HEWAN_MODEL.destroy({
        where : {
            id : id
        }
    }).then( result =>{
        if(result){
            res.status(200).json({
                message : "Hewan was deleted successfully!"
            })
        }else{
            res.status(404).json({
                message : "Hewan not found!"
            })
        }
    }).catch(error =>{
        res.status(500).json({
            message:  error
        })
    })
})

const connectAuth = () =>{
    sequelize
    .authenticate()
    .then(() =>{
        console.log("connection has been established succesfully")
    })
    .then(()=>{
        hewan.sync().then(()=> console.log("table hewan created"))
    })
    .catch(err =>{
        console.error(err)
    })
}

app.listen((process.env.PORT || 3000), ()=>{ // jangan di hardcode port nya nanti malah gabisa
    console.log(`listening at http://localhost: ${3000}`)
    connectAuth()
})