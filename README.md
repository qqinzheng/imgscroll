## 图片懒加载简易实现

```html
<body>
    <img data-src="./images/pic1.jpg" alt="image">
    <img data-src="./images/pic2.jpg" alt="image">
    <script src='https://cdn.bootcss.com/zepto/1.0rc1/zepto.min.js'></script>
    <script src='imgscroll.js'></script>
    <script>
        $(function(){
            window.ImageLazy.init({scroll: window});
        });
    </script>
</body>



