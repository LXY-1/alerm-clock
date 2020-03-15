<!--
 * @Description: 
 * @version: 
 * @Author: lxw
 * @Date: 2020-03-05 00:37:36
 * @LastEditors: lxw
 * @LastEditTime: 2020-03-15 22:54:47
 -->
## 一些简单的开发笔记。(ps：随记，有些凌乱)

### 第一部分案例功能说明
- 功能简单说明
> 这是一个通过调用三个封装的独立插件——时钟插件、时间选择器插件、鼠标点击文字特效插件实现的 时钟走动 +闹钟设置小工具

- 三个自己封装的组件
[link1]()、[link2]()、[link3]()

- 代码部分说明

1. 各插件组件css部分
> 详细参看`css/lib/*.css`
2. 各插件组件html模板部分
> 详细参看index.html部分
3. 各插件js部分
>详细参看`js/*.js`

4. 功能主体业务逻辑相关代码
```js
  /**
         * 
         * 功能实现调用封装的以下几个插件，均使用子调用函数 + 闭包 + 面向对象开发（组合模式)，时间选择器插件使用了单例模式
         * 时钟插件；暴露：ClockAlerm
         * 时间选择器插件：暴露：timeSlider
         * 鼠标点击展示文字特效或爱心特效：clickShowEffect
         * 
  **/


        // 创建时钟插件实例对象
        let clock1 = new ClockAlerm()
        clock1.initSet('clock-wrap1')
        // 如果需要支持缓存，必须调用下面这个方法通过回调函数获取上次设置的闹钟时间等信息，再写其他的业务逻辑
        clock1.localStroageInit(function (bol, alermInfo) {
            if (bol) {
                console.log(alermInfo)
                setAlermInfo(alermInfo, alermInfo)
            }
        })


        //点击闹钟按钮，初始化时间选择器，显示弹出层，开启小时、分钟设置，开启闹铃选择功能
        document.getElementById('showTimeSlide').onclick = () => {
            // 创建弹出时间选择插件实例，参数未挂载元素的id ，目前除了时间选择，还为其扩展了一个选择铃声功能，调用方法：`rignTone`
            const timeSlide1 = timeSlider(true, 'model-wrap1', 'hour-second', function (timeInfo) {
                console.log(timeInfo)
            }, [
                    {
                        name: 'ringSelect',
                        cball: function (src) {
                            console.log('每次选择铃声调用', src)
                        }
                    }
                ]
            )
            timeSlide1.show()

            // 时间选择器的确定、取消按钮获取
            // 点击确定，进行闹钟的时间赋值和闹铃赋值：两个插件之间的访问
            const confirmEle = document.getElementById('confirm')
            const cancelEle = document.getElementById('cancel')
            // 点击关闭闹钟按钮
            const closeAlerm = document.getElementById('close-alerm')

            confirmEle.onclick = function () {
                // 获取设置的闹钟时间
                let time = timeSlide1.getSelecttime()
                // 获取选中的铃声信息
                let audioInfo = timeSlide1.getSelectRing()
                audioInfo = typeof audioInfo === 'string' ? JSON.parse(audioInfo) : audioInfo
                // 特别说明，这里的闹钟功能，仅设置一天范围之内，所以需要确保你设置的时间大于当前时
                setAlermInfo(time, audioInfo)
                timeSlide1.hide()
            }

            cancelEle.onclick = function () {
                timeSlide1.hide()
            }

            closeAlerm.onclick = function () {
                const endInfo = document.getElementById('end-alerm-info')
                endInfo.style.opacity = 0;
                endInfo.style.transform = 'translateY(0px)'
                clock1.closeAlerm()
            }


        }

        /**
             * @name: 
             * @description: 根据自己需要设置一些闹钟相关信息，在相关api的回调函数进行业务逻辑处理
             * @msg: 
             * @param {type} 
             * @return: 
         */
        function setAlermInfo(time, audioInfo) {
            const alermWrap = document.getElementById('alerm-info')
            const spans = alermWrap.getElementsByTagName('span')
            const endInfo = document.getElementById('end-alerm-info')
            spans[0].innerText = `${time.hour}:${time.minute}`
            spans[2].innerText = `${audioInfo.name}`
            alermWrap.style.opacity = 1
            clock1.alerm({
                hour: time.hour,
                minute: time.minute,
                src: audioInfo.src,
                name: audioInfo.name
            }, function (num) {
                if (num === 'valid') {
                    alert('当前仅支持24小时内闹钟，请设置大于当天当前的时间段')
                    alermWrap.style.opacity = 0
                    return
                }
                //num表示当前倒计时还剩余的秒数，0表示结束
                console.log(num)
                spans[1].innerText = `${num}s`
                if (num === 0) {
                    // 闹钟时间到了，这里可以根据自己的需要写业务逻辑
                    //显示提醒时间到了的信息
                    alermWrap.style.opacity = 0
                    endInfo.style.opacity = 1
                    endInfo.style.transform = 'translateY(-100px)'

                }
            })
        }

        // 加入鼠标点击展示随机文字特效
        clickShowEffect(
            {
                type: 'words', // 模式:words:点击出现文字特效，love：点击出现爱心特效
                // zIndex:10000
            }
        )
```

### 第一部分开发经验记录所得

#### 1. 实现稍微复杂的功能模块，最好仍然借助工具比如草稿罗列功能逻辑层次，还有涉及的核心变量层次，以及相关的演算，比较复杂的不要大脑演算了，你的能力仍然会导致经常出错，各种错误又加长了开发时间，如果一开始就草稿纸演算好，也是方便进行正确的抽象，另一方面功能逻辑的变量清晰的可以更方便debug，发现某个部分不符合业务功能需求，根据这个部分涉及的变量以及变量值的由来，可以更高效debug

#### 2. 有些功能需求由于时间原因无法很快做到好的封装，可以先对保证代码基本质量下对功能进行实现，确保不耽误工期，后面再进行合理的封装，优化。当然，基于公司或者是其他的优秀模板框架下开发业务逻辑可以不用像原生那样考虑那么多。

#### 3. 关于this作用域也就是this不同函数环境指向的对象
> 关键词：`构造函数` `方法内部this指向性` ,梳理如下:
> 原型方法内部this指向使用对应构造函数创建的对象,但是如果方法内部有js内置方法或者是时间处理程序它们的this不会指向构造函数创建的对象
> 解决方案:使用一个变量保存外部this,或者是直接使用构造函数

#### 4. 回调函数使用
> change回调函数由于每次改变选择的时间的时候触发.

#### 5. css伪元素before、after的巧妙使用，
> 比如使用css制作一些简单的且依附性比较强，固定形状，无需要复杂的js交互切换图标样式，简单的交互也是可以的，
> 比如使用befroe通过控制border制作的left箭头，点击之后需要切换成倒三角形，此时如果使用伪类active实现的话，鼠标点击其他地方
> 它又恢复了，此时可以通过鼠标点击控制一个新的class（用于实现befroe倒三角，比如旋转一下即可以了)来实现点击
>可以不用特意去再写一个html标签，直接使用它实现即可。

#### 6. 关于js控制css样式实现菜单或者是列表的缩放问题
> 一般的解决方案是控制缩放菜单内容的height，或者是使用transform:scale(0)实现
> 使用transform:scale(0)实现很简单，也不用计算高度，但是有一个问题是，使用使用transform不会导致页面重绘，不会影响其他元素的样式，也就是原本菜单内容占用的空间，使用transform:scale(0)收缩菜单之后，它仍然存在，所以如果是一行行的垂直排列的列表，每一列表都收缩的子内容并且希望缩起一列表之后，空间释放， 紧接着下面的第二个列表可以顶上去，此时单纯使用transform:scale(0)就没办法了，仍然需要控制height + overflower：hidden来实现。


#### 8. input file 限定可选择文件类型问题
> 由于后期更多的上传文件功能都是基于第三方插件，所以一直没有一发现下面这个bug
> 使用input file accept属性来指定需要上传的文件的MINE类型时，使用*代替具体的MINE类型时，比如 `<input name="imageFile type="file" accept="image/*"/>` 此时在Chrome和Safari等Webkit浏览器下却出现了响应缓慢的问题，在ie和Firefox中使用，则不会。产生的原因是：
> 在chrome和safari浏览器中，设置`accept="image/*"`属性会对每一个文件都遍历一次所有的”image/*”文件类型，当文件较多时，文件的检验时间较长。
> 解决方案是：将 *通配符修改为具体的MIME类型，修改，如下
> `<input name="imageFile type="file" accept="image/gif,image/jpeg,image/jpg,image/png">`
> 补充：MINE类型，可以根据自己的需要查看[link](https://www.cnblogs.com/hongfei/articles/2262234.html)

#### 9. 解决Chrome浏览器无法网页打开自动播放音视频问题
1. 关于Chrome音频自动播放问题
> chrome浏览器无法自动播放音频视频,如果网页打开用户不进行任何交互操作下直接调用音视频的play方法报错：Uncaught (in promise) DOMException
2. 禁止的特点

```
谷歌浏览器最新版本只允许

静音的音频
有用户行为发生时
播放器没有被隐藏的
时候才能执行autoplay
```
3. 解决思路
> 根据上面分析，只要把audio标签给显示出来，不隐藏掉，即可以支持autoplay自动播放，但是如果是调用音频的play()方法，仍然报错：Uncaught (in promise) DOMException
> 解决方法：直接加入autoplay属性，让播放器显示出来，加controls="controls"，同时设置opcity为0，在初始化页面后，对audio其赋值src属性即可
> ps:注意：设置display为none，或者height为0都无效，此时谷歌浏览器仍然判断其被隐藏了


#### 10. js 控制节点的css样式相关
- 单纯使用js设置节点的某一两个css属性的话，我们可能比较常使用xx.style.cssProperty来设置
- 但是如果需要批量修改呢？一个个css属性去设置的话一方面导致代码冗余另一方通过JS来覆写对象的样式是比较典型的一种销毁原样式并重建的过程，种销毁和重建，都会增加浏览器的开销，如果一个个属性都去这样设置一下，会造成一个定的性能问题。所以我们可以使用  `cssText`
- 关于`cssText`
```js
element.style.cssText="width:20px;height:20px;border:solid 1px red;";
```
这样就可以尽量避免页面reflow，提高页面性能。
但是需要注意，由于是属性值覆写，所以你原本赋值的cssText会被你当前（如上）设置的cssText给覆盖掉，当然解决起来也很简单，字符累加就行了
```js
Element.style.cssText += ‘width:100px;height:100px;top:100px;left:100px;’
```
但是上面的方法在ie中是无效的，所以最后可以这样解决
```js
Element.style.cssText += ‘;width:100px;height:100px;top:100px;left:100px;’
```

#### 11. 弹出时间选择器 —— 单例对象应用：只需实例化一次。
>实现原理：闭包实现单例模式，由于时间空间选择器涉及到dom的追加，无需要重复创建多次。

#### 12.整个完整功能涉及部分：基于几个部分的自己封装的非可插拔的插件
- 闹钟插件：时钟旋转，时钟闹钟功能
- 弹出使时间选择器插件 + 自定义弹出层的footer部分：主要是构建铃声选择样式和js脚本，footer部分是属于旋转默认铃声和自定义铃声功能，这里把它当作弹时间选择器的扩展功能，扩展的方式是通过原型继承来扩展，调用方法默认需要给扩展功能，此时需要引入对应的css样式还有html模板。
- 综合使用 ： 调用时间选择器选择时间之后，通过api获取到选择的时间后赋值给时钟闹钟插件相关的api方法属性。铃声部分是扩展进去的，通过选择铃声后同样赋值给时钟闹钟插件相关的api方法属性

#### 13. 关于封装的动画效果弹出时间选择器插件的使用

1. html层
```html
<div class="model-wrap">
        <!-- model-menu 是盒子显示隐藏动画效果类，只要把该类给需要的盒子即可 -->
        <div class="model-menu">
            <div class="model-content">
                <h3>选择时间</h3>
                <div class="model-body">
                    <!-- 上下滚动的select选择器 -->
                    <div class="select-hour">
                        <ul id='select-hour'>

                        </ul>
                    </div>
                    <div class="select-minute">
                        <ul id="select-minute">
                            
                        </ul>
                    </div>
                </div>
                <div class="model-footer"></div>
            </div>
        </div>

    </div>
```
2. css层
```css
.model-menu {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, .35);
            z-index: 999;
        }

        .model-menu .model-content {
            position: fixed;
            top: 50%;
            left: 50%;
            width: 50%;
            max-width: 630px;
            min-width: 320px;
            height: auto;
            z-index: 2000;
            transform: translate(-50%, -50%);
            color: #fff;
            background: #ff0080;
            border-radius: 5px;

        }

        .model-menu .model-content h3 {
            text-align: center;
            font-size: 25px;
            padding: 10px 0;
            font-weight: 300;
            opacity: .8;
            background: rgba(0, 0, 0, 0.5);
        }

        .model-menu .model-content .model-body {
            padding: 15px;
            width: 80%;
            margin-left: 10%;
            overflow: hidden;
            display: flex;
            justify-content: center;
            height: 250px;
        }

        .model-menu .model-content .model-body ul {
            /* float: left; */
            list-style: none;
            margin-right: 30px;
            cursor: pointer;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            transition: .5s;
            position: relative;
            /* transform: translateY(-108px); */
        }

        .model-menu .model-content .model-body ul li {
            padding: 10px;
            font-size: 25px;
            font-weight: bold;
        }

        .model-menu .model-content .model-body ul .active {
            color: #7fb80e;
            position: relative;
        }

        .model-menu .model-content .model-body .select-hour .active::before {
            content: '时';
            position: absolute;
            left: 82%;
            top: 24%;
            font-size: 14px;
        }

        .model-menu .model-content .model-body .select-minute .active::before {
            content: '分';
            position: absolute;
            left: 82%;
            top: 24%;
            font-size: 14px;
        }

```
3. js调用层
 - 插件时间选择器对象
 ```js
  const timeSlide1 = new timeSelect()
 ```
 - 可以只创建小时选择器或者是分钟选择器
    1. 创建小时选择器
    ```js
    timeSlide1.setHour('select-hour',function(hourNum){
                 console.log(hourNum)
         })
    ```
    其中`select-hour`是小时选择器ul标签的id,第二个参数是回调函数,每次选择新的时间就会触发,通过参数hourNum获取当前选择的时间,如果需要实时更新触发执行某些业务逻辑以用得上
    2. 创建分钟选择器,类同
    ```js
     timeSlide1.setMinute('select-minute',function(minuteNum){
                 console.log(minuteNum)
         })
    ```
- 同时创建小时和分钟选择器,两个方法都调用
```js
timeSlide1.setHour('select-hour',function(hourNum){
                 console.log(hourNum)
         })
timeSlide1.setMinute('select-minute',function(minuteNum){
                 console.log(minuteNum)
         })       

```
- 获取当前选择的时间
  1. 通过上面介绍的回调函数
  2. 通过调用`getSelecttime`方法,返回一个带有`hour`和`minute`属性的对象
  ```
  let currentTime = timeSlide1.getSelecttime()
  console.log(currentTime.hour)
  console.log(currentTime.minute)
  ```