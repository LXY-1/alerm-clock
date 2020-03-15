/**
        * 获取当前时间后的时钟走动，内部使用原型方式扩展相关功能函数，比如给时钟添加一个闹钟功能
        * 可以自由设置时、分、秒
        * 可以自由重置时、分、秒
        * 可以校准时间:由于意外的bug导致时间不准缺的时候可以使用。
        * 设置闹钟功能：闹钟动画效果：水波纹，加声音，可以本地设置闹钟声音
        * */


// 显然使用css3动画，设置对应的动画实践以及设置动画速度匀速就可以很漂亮实现时钟移动了
// 但是单纯使用css3实现不了正常的时钟走动，只能实现一个每次从固定时间点进行走动的时钟
// 如果需要实现判断当前时分秒，初始化时分秒针位置，以及转到360deg后需要的时间，但是你还得在它们各自转好了360deg
// 只会给他们各自分配一个新的动画：0deg - 360deg的css3动画，
// 显然需要涉及到阶段的自定义控制的，显然只是使用css3动画是做不到的，还需要js配合，有些还挺麻烦的，此时我们想有些特别复杂的那还不如
//直接使用js实现，但是使用js原生实现动画真的只能使用setTimeout和setTimeInterval嘛
// 不是的，其实还有一个web animaintone api 但是有兼容性问题
// 但是使用css3还是需要js配合：获取当前时间初始化时、分、秒针的位置，

//// 如果是js控制需要这样考虑，
//    对于秒针而言，60s:360deg,也就是1秒6deg，使用间隔函数控制1s，内部是秒针转过6deg，分针旋转依照秒针，60分钟：3600s：360deg，
// 也就是0.1deg/s，同理时针：1h：60分钟：3600s：30deg：0.0083deg/s

// 获取当前秒、分、时、转换为度数



const ClockAlerm =  (function () {
    function ClockRotate(option) {
        let opt = getDeg();
        opt = Object.assign(opt, option)
        console.log(opt)
        // 单位deg
        this.second = opt.second
        this.minute = opt.minute
        this.hour = opt.hour
        this.ele = null // 挂载节点
        this.counter = null
        this.localStorageInfo = null // 管理需要缓存的信息，既数据持久化对象


    }
    //    初始化当前时、分、秒针位置，以及各自转完360deg后所需要的时间
    ClockRotate.prototype.initSet = function (ele) {
        const clockWrap = document.getElementById(ele);
        const secondEle = clockWrap.getElementsByClassName('second')[0]
        const minutedEle = clockWrap.getElementsByClassName('minute')[0]
        const hourdEle = clockWrap.getElementsByClassName('hour')[0]

        this.ele = clockWrap

        secondEle.style.transform = `translate(-50%,0) rotate(${this.second}deg)`
        minutedEle.style.transform = `translate(-50%,0) rotate(${this.minute}deg)`
        hourdEle.style.transform = `translate(-50%,0) rotate(${this.hour}deg)`

        // 当前位置各自转到360deg所需要的时间
        let currentSecondTime = this.second === 0 ? 60 : (360 - this.second) / 6
        let currentMinuteTime = this.minute === 0 ? 3600 : (360 - this.minute) * 10
        let currentHourTime = this.hour === 0 ? 43200 : (360 - this.hour) * 120

        secondEle.style.animationDuration = `${currentSecondTime}s`
        minutedEle.style.animationDuration = `${currentMinuteTime}s`
        hourdEle.style.animationDuration = `${currentHourTime}s`

        // 需要监听第一次时、分、秒针转到360deg的情况，如果单纯使用js的话，那岂不是需要去轮询检测，
        // 所以我们试试使用animationiteration 事件,也就是css3动画没执行完一遍后触发

        let secondFirst = true
        let minuteFirst = true
        let hourFirst = true

        //  Chrome, Safari 和 Opera 代码
        secondEle.addEventListener('webkitAnimationIteration', changeSecond)
        secondEle.addEventListener('animationiteration', changeSecond)
        minutedEle.addEventListener('webkitAnimationIteration', changeMinute)
        minutedEle.addEventListener('animationiteration', changeMinute)
        hourdEle.addEventListener('webkitAnimationIteration', changeHour)
        hourdEle.addEventListener('animationiteration', changeHour)
        function changeSecond() {
            if (secondFirst) {
                // 第一次
                secondEle.style.animationName = 'secondMove1'
                secondEle.style.animationDuration = '60s'
            }
            secondFirst = false
        }
        function changeMinute() {
            if (minuteFirst) {
                // 第一次
                minutedEle.style.animationName = 'minuteMove1'
                minutedEle.style.animationDuration = '3600s'
            }
            minuteFirst = false
        }
        function changeHour() {
            if (hourFirst) {
                // 第一次
                hourdEle.style.animationName = 'hourMove1'
                hourdEle.style.animationDuration = '43200s'
            }
            hourFirst = false
        }

    }
    /**
     * @name: 数据持久化方法
     * @description: 判断是否存在缓存，需要的话就从缓存中获取信息如果设置的闹钟需要支持缓存，也就是下次打开网页，闹钟时间还没有结束的时候继续倒计时，需要调用这个方法
     * ************  简单说这个方法，判断是否有还未结束的闹钟，使用的时候调用这个方法，通过方法的回调函数获取上次设置的时间和铃声，根据自己的需要写业务逻辑
     * @msg: 
     * @param {type} 
     * @return: 
     */
    ClockRotate.prototype.localStroageInit = function (cball) {
        if (localStorage.getItem('localStorageInfo')) {
            // 获取信息  
            this.localStorageInfo = JSON.parse(localStorage.getItem('localStorageInfo'))

            cball(true, this.localStorageInfo)

        } else {
            cball(false, '')
        }
    }

    ClockRotate.prototype.alerm = function (options, cball) {
        let opt = {
            hour: 13,
            minute: 50,
            src: './audio/audio1.mp3',
            name: '清脆铃声'//默认铃声
        }
        options = Object.assign(opt, options)
        console.log(options)
        //每次调用闹钟后对信息进行持久化
        localStorage.setItem('localStorageInfo', JSON.stringify(options))
        let date = new Date()
        let currentHour = date.getHours()
        let currentMinute = date.getMinutes()
        let currentSeconds = date.getSeconds()
        let secondNum = ((parseInt(options.hour) - currentHour) * 60 + (parseInt(options.minute) - currentMinute)) * 60 - currentSeconds
        secondNum = secondNum > 0 ? secondNum : 0
        if (secondNum === 0) {
            localStorage.setItem('localStorageInfo', '')
            cball('valid')
            return
        } else {
            //   使用计时器开启倒计时，根据换算得出的秒数
            if (this.counter !== null) {
                clearInterval(this.counter)
            }
            this.counter = setInterval(() => {
                secondNum--
                if (secondNum === 0) {
                    clearInterval(this.counter)
                    //清楚缓存
                    localStorage.setItem('localStorageInfo', '')
                    // 播放铃声
                    const ringAudio = this.ele.getElementsByTagName('audio')[0]
                    ringAudio.src = options.src
                    // 调用时钟动态效果,
                    this.animationMove()
                }
                cball(secondNum)
            }, 1000);
        }
    }

    /**
     * @name: 
     * @description: 关闭闹钟
     * @msg: 
     * @param {type} 
     * @return: 
     */
    ClockRotate.prototype.closeAlerm = function () {
        const ringAudio = this.ele.getElementsByTagName('audio')[0]
        ringAudio.pause()
        // 调用时钟动态效果,
        this.animationMove('close')
    }

    /**
     * @name: 时钟各种动态效果
     * @description: 
     * @msg: 
     * @param {String} animatioPattern | 动态效果类型，暂未实现TODO: 
     * @return: 
     */
    ClockRotate.prototype.animationMove = function (animatioPattern) {
        if (animatioPattern === 'close') {
            this.ele.style.animationName = 'none'
            return
        }
        this.ele.style.animationName = 'clockMove'
    }

    /**
     * @name: 
     * @description: 对应的小时、分钟、秒转为角度
     * @msg: 
     * @param {type} 
     * @return: 
     */
    function getDeg() {
        const dateObj = new Date();
        let degObj = {
            second: (dateObj.getSeconds() % 60) * 6,
            minute: (dateObj.getMinutes() % 60) * 6,
            hour: (dateObj.getHours() % 12) * 30 + (dateObj.getMinutes() % 60) / 2
        }
        console.log(degObj.minute + 'deg')
        return degObj;
    }

    return ClockRotate

})()

