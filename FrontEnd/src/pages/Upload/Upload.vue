<template>
  <div id="upload">
    名字： <input type="text" v-model="name">

      <div class="item">
        <ImgInputer
          auto-upload
          action="http://111.229.237.104:3305/upload"
          :on-error="onErr"
          v-model="file"
          @onChange="fileChange"
        ></ImgInputer>
        <h1>
          <code>auto-upload</code>
        </h1>
      </div>
    <button @click="submit">提交</button>

  </div>
</template>

<script>
import ImgInputer from 'vue-img-inputer'
import 'vue-img-inputer/dist/index.css'
import axios from 'axios'

export default {
  name: 'upload',
  components: {
    ImgInputer
  },
  data () {
    return {
      name: null,
      file: null
    }
  },
  mounted () {
  },
  methods: {
    submit () {
      console.log(123)
      let data = {
        name: this.name
      }
      axios.post('/api/upload/create', data)
        .then(res => {
          console.log(res)
        })
    },
    /* vue-img-inputer  methods start */
    fileChange (file, name) {
      console.log('File --> ', file)
      console.log('FileName -->', name)
    },
    onErr (err, file) {
      console.log('​onErr -> file', file)
      console.log('​onErr -> err', err)
    },
    exceedHandler (file) {
      console.warn('onExceed -> file', file)
    }
    /* vue-img-inputer  methods end */
  }
}
</script>

<style scoped>
#upload {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  padding-bottom: 100px;
}
.test-inputer {
  margin-top: 50px;
}
code {
  background: #35495e;
  padding: 5px 20px;
  display: inline-block;
  color: #ffeb59;
  font-size: 28px;
  line-height: 1.5;
  border-radius: 5px;
}
h1,
h2 {
  font-weight: 400;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.img-inputer {
  margin-top: 60px;
}
.wrapper {
  width: 800px;
  margin: 0 auto;
  display: flex;
  flex-flow: row wrap;
}
.item {
  flex: 1 50%;
  display: flex;
  flex-flow: column;
  align-items: center;
}
</style>
