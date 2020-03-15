
const clickShowEffect = (function () {
    /**
     * @name: 
     * @description: 鼠标点击效果插件：鼠标点击出现颜色爱心或者是“富强、文明、名著....”
     * @msg: 
     * @param {Object} EffectOption | 所有必要或者不必要的参数使用一个参数对象保存，这样更灵活更好维护
     *  {
            type: 'words', // 模式:words:点击出现文字特效，love：点击出现爱心特效
            wrapEleString: '',// 默认是空字符表示挂载的节点是body
            fontOptions: ["富强", "民主", "文明", "和谐", "自由", "平等", "公正", "法治", "爱国", "敬业", "诚信", "友善"],//默认文字效果随机显示的文字，如果type是love模式设置这里无效
            zIndex: 1,//默认文字或者是爱心dom的层级，可以通过设置这个 来修改层级，如果效果显示不出来的话。

        }
     * @return: 
     */

    function clickEffect(EffectOption) {
        let defaultOptions = {
            type: 'words', // 模式:words:点击出现文字特效，love：点击出现爱心特效
            wrapEleString: '',// 默认是空字符表示挂载的节点是body
            fontOptions: ["富强", "民主", "文明", "和谐", "自由", "平等", "公正", "法治", "爱国", "敬业", "诚信", "友善"],//默认文字效果随机显示的文字
            zIndex: 1,//默认文字或者是爱心dom的层级，可以通过设置这个 来修改层级，如果效果显示不出来的话。

        }
        EffectOption = Object.assign(defaultOptions, EffectOption)
        const wrapEle = EffectOption.wrapEleString ? document.getElementById(EffectOption.wrapEleString) : document.body
        wrapEle.onclick = function (e) {
            if (EffectOption.type === 'words') {
                showWords(e, wrapEle, EffectOption.fontOptions, EffectOption.zIndex)
            } else if (EffectOption.type === 'love') {
                showLove(e, wrapEle, EffectOption.zIndex)
            }
        }

    }

    // 展示文字核心方法
    function showWords(e, wrapEle, option, zIndex) {
        let ev = e || window.event
        let x = ev.pageX, y = ev.pageY

        let fontEle = document.createElement('div')
        let fontText = document.createTextNode(`${option[parseInt(Math.random() * option.length)]}`)
        fontEle.appendChild(fontText)
        //    下面是需要进行css相关样式设置，不想额外而入css文件，所以通过js设置css，但是由于需要操作的style属性很多，如果一个个css属性设置
        //    一方面代码很多，同时通过JS来覆写对象的样式是比较典型的一种销毁原样式并重建的过程，这种销毁和重建，都会增加浏览器的开销。
        //    所以这里我们使用 style 的另一个一个属性：`cssText` 这样就可以尽量避免页面reflow，提高页面性能。
        let radomColor = `rgb(${~~(255 * Math.random())},${~~(255 * Math.random())},${~~(255 * Math.random())})`
        fontEle.style.cssText += `;position:absolute;left:${x}px;top:${y}px;width:50px;height:17px;font-weight:bold;font-size:19px;color:${radomColor};transition:.7s;opacity:.7;z-index:${zIndex};`
        wrapEle.style.position = 'relative'
        wrapEle.appendChild(fontEle)
        setTimeout(() => {
            fontEle.style.opacity = 0
            // 从现在开始你必须进行大的测试当中，利用你的自己的不管测测试当u总方法对付 房贷首付  反对法  放大 放大
            setTimeout(() => {
                wrapEle.removeChild(fontEle)
            }, 1000);
        }, 400);
    }
    function showLove(e, wrapEle, zIndex) {
        let ev = e || window.event
        let x = ev.pageX, y = ev.pageY

        let loveElWrap = document.createElement('div')
        let loveLeft = document.createElement('div')
        let loveRight = document.createElement('div')
        let loveBottom = document.createElement('div')
        let radomColor = `rgb(${~~(255 * Math.random())},${~~(255 * Math.random())},${~~(255 * Math.random())})`
        let commoneCssText = `width: 100%;height: 100%;position: absolute;border-radius: 50% 50% 0 0;background:${radomColor};`
        loveElWrap.style.cssText += `;position:absolute;left:${x}px;top:${y}px; width: 30px;height: 30px;z-index:${zIndex};transition:.5s;`
        loveLeft.style.cssText += `;transform: translateX(-50%) rotate(-45deg);${commoneCssText}`
        loveRight.style.cssText += `;transform:rotate(45deg);${commoneCssText}`
        loveBottom.style.cssText += `; transform: rotate(45deg) translateY(10px);${commoneCssText}`
        wrapEle.style.position = 'relative'
        loveElWrap.appendChild(loveLeft)
        loveElWrap.appendChild(loveRight)
        loveElWrap.appendChild(loveBottom)
        wrapEle.appendChild(loveElWrap)
        setTimeout(() => {
            loveElWrap.style.opacity = 0
            // 从现在开始你必须进行大的测试当中，利用你的自己的不管测测试当u总方法对付 房贷首付  反对法  放大 放大
            setTimeout(() => {
                wrapEle.removeChild(loveElWrap)
            }, 1000);
        }, 400);
    }
    return clickEffect
})()