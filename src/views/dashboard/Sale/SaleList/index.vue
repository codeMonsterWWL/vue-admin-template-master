<template>
  <div class="list">
    <h3>门店销售排名</h3>
    <ul>
      <li>
        <span class="index">1</span>
        <span>肯德基</span>
        <span class="zuiyou">132,654</span>
      </li>
       <li>
        <span class="index">2</span>
        <span>麦当劳</span>
        <span class="zuiyou">453,452</span>
      </li>
       <li>
        <span class="index">3</span>
        <span>胖哥俩</span>
        <span class="zuiyou">78,652</span>
      </li>
       <li>
        <span class="index2">4</span>
        <span>海底捞</span></span>
        <span class="zuiyou">77,244</span>
      </li>
       <li>
        <span class="index2">5</span>
        <span>肉蟹煲</span>
        <span class="zuiyou">72,782</span>
      </li>
       <li>
        <span class="index2">6</span>
        <span>汉堡王</span>
        <span class="zuiyou">75,222</span>
      </li>
       <li>
        <span class="index2">7</span>
        <span>大漠烧烤</span>
        <span class="zuiyou">47,256</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name:'list'
}
</script>

<style scoped>
.list{
  padding: 5px 5px
}
ul{
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0;
}
ul li{
  height: 8%;
  margin: 10px 0;
}
ul li span{
  margin: 0 10px
}
.index{
  float: left;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: black;
  color:white;
  text-align: center;
}
.zuiyou{
  float: right;
}
.index2{
  float: left;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  color:black;
  text-align: center;
}
</style>