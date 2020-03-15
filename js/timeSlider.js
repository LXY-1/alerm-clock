/**
 * @name: 时间选择器插件
 * @description: 时间选择器插件 + 扩展铃声选择功能 + 封装单例模式：只实例化一次时间选择器对象
 * @msg: 
 * @param {type} 
 * @return: 
 */
const timeSlider = (function () {
      /**
         * @name: 时间选择器插件
         * @description:  闹钟时间选择器插件,扩展了铃声选择功能
         * @msg: 
         * @param {type} ele : {String} | 挂载id。
         * @return: 
         */
        function TimeSelect(ele) {
            //dom对应的数据层,数据层的建立主要一个方面方便更新dom，先遍历数据层后再更加修改过渡数据层更新dom
            // 关键就是每一个处于第三个位置（也就是被选中位置的时候）各自对应的ul的transform：translateX
            this.ele = ele
            this.timeHourObj = []
            this.timeMinuteObj = []

            //每次移动的步伐
            this.sliverNum = 0


            this.hEle = null
            this.mEle = null
        }
        /**
         * @name: 
         * @description: 创建小时选择器，默认选中当前时间的小时
         * @msg: 
         * @param {type} 
         * @return: 
         */
        TimeSelect.prototype.setHour = function (eleString, cabllFun) {
            const hourSelectEle = document.getElementById(eleString)
            this.hEle = hourSelectEle
            let date1 = new Date()
            let currentHour = date1.getHours()
            this.createTimeEle(hourSelectEle, currentHour, 23, this.timeHourObj)


            // 默认显示当前时间，需要控制时间ul的transform根据timeHourObj
            let distance = 0// 记录当前translateY的值
            if (currentHour >= 2) {
                let y = this.timeHourObj[currentHour].tranxlateY
                hourSelectEle.style.transform = `translateY(${y}px)`
                distance = y
            } else {
                let y = this.timeHourObj[currentHour].tranxlateY
                hourSelectEle.style.transform = `translateY(${y}px)`
                distance = y
            }



            //到这里完整的数据层和dom层已经构建好了,下面是移动相关的
            let hourSelectBol = false
            let hourStart = 0
            let middleDistance = 0

            hourSelectEle.onmousedown = function (e) {
                let ev = e || window.event
                hourStart = ev.pageY
                hourSelectBol = true

            }
            hourSelectEle.onmouseup = function (e) {
                hourSelectBol = false
                let ev = e || window.event
                // 每次松开手后记录当前的translateY
                distance = middleDistance
                console.log(distance)
            }
            hourSelectEle.onmouseleave = function (e) {

                let ev = e || window.event
                // 每次松开手后记录当前的translateY.这个很关键
                if (hourSelectBol) {
                    distance = middleDistance
                }
                hourSelectBol = false
                console.log(distance)
            }
            hourSelectEle.onmousemove = (e) => {
                if (hourSelectBol) {
                    let ev = e || window.event
                    //    这里有两个需要获取
                    // 1. 鼠标移动距离；距离初始位置的距离:move.offsetY-start.offsetY
                    // 2. 鼠标移动的方向：也就是活动的方向
                    // offsetY是相对与带有定位的盒子的y坐标，所以ul需要设置定位
                    let movedistance = ev.pageY - hourStart
                    // console.log(movedistance, distance)
                    // 临界值的处理
                    let correctNum = 0;
                    if ((movedistance + distance) >= this.timeHourObj[0].tranxlateY) {
                        correctNum = this.timeHourObj[0].tranxlateY
                    } else if ((movedistance + distance) <= this.timeHourObj[this.timeHourObj.length - 1].tranxlateY) {
                        correctNum = this.timeHourObj[this.timeHourObj.length - 1].tranxlateY
                    } else {
                        correctNum = movedistance + distance
                        console.log(movedistance, distance)
                        for (let i = 0; i < this.timeHourObj.length; i++) {

                            if (correctNum >= 0) {
                                if (Math.abs(this.timeHourObj[i].tranxlateY - correctNum) <= this.sliverNum / 2) {
                                    correctNum = this.timeHourObj[i].tranxlateY
                                    break
                                } else {
                                    continue
                                }
                            } else {
                                if (Math.abs(this.timeHourObj[i].tranxlateY - correctNum) <= this.sliverNum / 2) {
                                    correctNum = this.timeHourObj[i].tranxlateY
                                    break
                                } else {
                                    // console.log('error',correctNum)
                                    continue
                                }
                            }


                        }


                    }
                    // 位置的更新
                    hourSelectEle.style.transform = `translateY(${correctNum}px)`
                    middleDistance = correctNum
                    // 对应选中的li添加文字颜色
                    for (let i = 0; i < this.timeHourObj.length; i++) {
                        const element = this.timeHourObj[i];
                        element.ele.className = ''
                        element.isActive = false
                        if (correctNum === element.tranxlateY) {
                            element.ele.className = 'active'
                            element.isActive = true

                            // 回调函数返回对应的信息
                            cabllFun(element.ele.innerText)
                        }

                    }

                }

            }
        }
        TimeSelect.prototype.setMinute = function (eleString, cabllFun) {
            const minuteSelectEle = document.getElementById(eleString)
            this.mEle = minuteSelectEle
            let date1 = new Date()
            let currentMinute = date1.getMinutes()
            this.createTimeEle(minuteSelectEle, currentMinute, 59, this.timeMinuteObj)

            // 默认显示当前时间，需要控制时间ul的transform根据timeMinuteObj
            let distance = 0// 记录当前translateY的值
            if (currentMinute >= 2) {
                let y = this.timeMinuteObj[currentMinute].tranxlateY
                minuteSelectEle.style.transform = `translateY(${y}px)`
                distance = y
            } else {
                let y = this.timeMinuteObj[currentMinute].tranxlateY
                minuteSelectEle.style.transform = `translateY(${y}px)`
                distance = y
            }

            //到这里完整的数据层和dom层已经构建好了,下面是移动相关的
            let hourSelectBol = false
            let hourStart = 0
            let middleDistance = 0
            minuteSelectEle.onmousedown = function (e) {
                let ev = e || window.event
                hourStart = ev.pageY
                hourSelectBol = true

            }
            minuteSelectEle.onmouseup = function (e) {
                hourSelectBol = false
                let ev = e || window.event
                // 每次松开手后记录当前的translateY
                distance = middleDistance
                console.log(distance)
            }
            minuteSelectEle.onmouseleave = function (e) {

                let ev = e || window.event
                // 每次松开手后记录当前的translateY.这个很关键
                if (hourSelectBol) {
                    distance = middleDistance
                }
                hourSelectBol = false
                console.log(distance)
            }
            minuteSelectEle.onmousemove = (e) => {
                if (hourSelectBol) {
                    let ev = e || window.event
                    //    这里有两个需要获取
                    // 1. 鼠标移动距离；距离初始位置的距离:move.offsetY-start.offsetY
                    // 2. 鼠标移动的方向：也就是活动的方向
                    // offsetY是相对与带有定位的盒子的y坐标，所以ul需要设置定位
                    let movedistance = ev.pageY - hourStart
                    // console.log(movedistance, distance)
                    // 临界值的处理
                    let correctNum = 0;
                    if ((movedistance + distance) >= this.timeMinuteObj[0].tranxlateY) {
                        correctNum = this.timeMinuteObj[0].tranxlateY
                    } else if ((movedistance + distance) <= this.timeMinuteObj[this.timeMinuteObj.length - 1].tranxlateY) {
                        correctNum = this.timeMinuteObj[this.timeMinuteObj.length - 1].tranxlateY
                    } else {
                        correctNum = movedistance + distance
                        console.log(movedistance, distance)
                        for (let i = 0; i < this.timeMinuteObj.length; i++) {

                            if (correctNum >= 0) {
                                if (Math.abs(this.timeMinuteObj[i].tranxlateY - correctNum) <= this.sliverNum / 2) {
                                    correctNum = this.timeMinuteObj[i].tranxlateY
                                    break
                                } else {
                                    continue
                                }
                            } else {
                                if (Math.abs(this.timeMinuteObj[i].tranxlateY - correctNum) <= this.sliverNum / 2) {
                                    correctNum = this.timeMinuteObj[i].tranxlateY
                                    break
                                } else {
                                    // console.log('error',correctNum)
                                    continue
                                }
                            }


                        }


                    }
                    // 位置的更新
                    minuteSelectEle.style.transform = `translateY(${correctNum}px)`
                    middleDistance = correctNum
                    // 对应选中的li添加文字颜色
                    for (let i = 0; i < this.timeMinuteObj.length; i++) {
                        const element = this.timeMinuteObj[i];
                        element.ele.className = ''
                        element.isActive = false
                        if (correctNum === element.tranxlateY) {
                            element.ele.className = 'active'
                            element.isActive = true

                            // 回调函数返回对应的信息
                            cabllFun(element.ele.innerText)
                        }

                    }

                }

            }
        }
        /**
         * @name: 
         * @description: 创建小时、分钟数选择器dom，追加到挂载节点
         * @msg: 
         * @param {type} index:当前默认选择的小时或者是分钟数
         * @return: 
         */
        TimeSelect.prototype.createTimeEle = function (SelectEle, index, length, timeObj) {
            for (let i = 0; i <= length; i++) {
                let liEle = document.createElement('li')
                let textNode = document.createTextNode(`${i < 10 ? '0' + i : i}`)
                liEle.appendChild(textNode)
                // 默认选中的位置，处于第几个，这里默认转动到第三列就是选中状态
                if (i === index) {

                    liEle.className = 'active'
                    timeObj.push({
                        ele: liEle,
                        isActive: true
                    })
                } else {
                    timeObj.push({
                        ele: liEle,
                        isActive: false
                    })
                }
                SelectEle.appendChild(liEle)

            }
            this.sliverNum = 52.8
            for (let i = 0; i <= length; i++) {
                // 化解得出统一公式
                timeObj[i].tranxlateY = this.sliverNum * (3 - i)


            }
            console.log(timeObj)

        }
        TimeSelect.prototype.getSelecttime = function () {
            let time = {
                hour: '',
                minute: ''
            }
            for (let i = 0; i < this.timeHourObj.length; i++) {
                const element = this.timeHourObj[i];
                if (element.isActive) {
                    time.hour = this.timeHourObj[i].ele.innerText
                }

            }
            for (let i = 0; i < this.timeMinuteObj.length; i++) {
                const element = this.timeMinuteObj[i];
                if (element.isActive) {
                    console.log(this.timeMinuteObj)
                    time.minute = this.timeMinuteObj[i].ele.innerText
                }

            }
            return time
        }
        // 扩展功能：默认铃声选择和自定义铃声选择

        // 默认铃声，可以自己修改默认音乐路径数组
        TimeSelect.prototype.ringToneAudios = [
            {
                name: '清脆铃声',
                src: './audio/audio1.mp3'
            },
            {
                name: '鸟语花香',
                src: './audio/audio2.mp3'
            },
            {
                name: '幽深山谷',
                src: './audio/audio3.flac'
            },
            {
                name: '高山流水',
                src: './audio/audio4.flac'
            },
            {
                name: '小乔人家',
                src: './audio/audio5.flac'
            }
        ]

        /**
         * @name: 
         * @description:点击切换展开默认铃声，点击自定义铃声选择自定义铃声，数据获取仍然通过回调函数
         * @msg: 
         * @param {type} audios:开发者自定义的默认铃声，caballfun：回调函数
         * @return: 
         */
        TimeSelect.prototype.ringTone = function (audios, caballfun) {
            const selectDefaultAudio = document.getElementById('select-defaule')
            const defaultRingWrap = document.getElementById('default-ring-wrap')
            const defaultRingWrapUl = document.createElement('ul')
            const customRing = document.getElementById('select-custom-rign')
            // 根据默认铃声生成列表
            let ringSongs = this.ringToneAudios
            if (Array.isArray(audios) && audios.length !== 0) {
                this.ringToneAudios = audios
            }
            let isDefault = false // 判断当前缓存中的铃声是默认列表的还是自定义选择本地文件
            for (let i = 0; i < ringSongs.length; i++) {
                const element = ringSongs[i];
                let liEle = document.createElement('li')
                let spanEle = document.createElement('span')
                if (localStorage.getItem('ringName')) {
                    if (ringSongs[i].name === JSON.parse(localStorage.getItem('ringName')).name) {
                        spanEle.className = 'active'
                        isDefault = true
                    }
                } else {
                    if (i === 0) {
                        spanEle.className = 'active'
                    }
                }

                let liText = document.createTextNode(ringSongs[i].name)
                liEle.appendChild(liText)
                liEle.appendChild(spanEle)
                liEle.setAttribute('audio-src', ringSongs[i].src)
                defaultRingWrapUl.appendChild(liEle)

            }
            defaultRingWrap.appendChild(defaultRingWrapUl)

            const lis = defaultRingWrap.getElementsByTagName('li')
            if (!isDefault) {
                lis[0].getElementsByTagName('span')[0].className = 'active'
            }



            // 缩放菜单
            const wrapHieght = 41 * lis.length
            let activeBol = false
            // 点击缩放默认铃声列表
            selectDefaultAudio.onclick = function () {
                if (!activeBol) {
                    this.className = `${this.className} active`
                    defaultRingWrap.style.height = `${wrapHieght}px`
                    activeBol = true
                } else {
                    this.className = 'select-rign-tone'
                    defaultRingWrap.style.height = '0'
                    activeBol = false
                }

            }
            //给每一个li绑定点击事件，选择默认铃声
            for (let i = 0; i < lis.length; i++) {
                const element = lis[i];
                element.onclick = function () {
                    let spanEle = this.getElementsByTagName('span')[0]
                    let obj = {
                        name: this.innerText,
                        src: this.getAttribute('audio-src')
                    }
                    localStorage.setItem('ringName', JSON.stringify(obj))
                    if (spanEle.className.indexOf('active') !== -1) {
                        caballfun(spanEle.getAttribute('audio-src'))
                        return
                    } else {
                        let spanEles = defaultRingWrapUl.getElementsByTagName('span')
                        for (let j = 0; j < spanEles.length; j++) {
                            spanEles[j].className = ''
                        }
                        spanEle.className = 'active'
                        caballfun(this.getAttribute('audio-src'))
                    }
                }
            }

            // 自定义铃声
            customRing.onclick = function () {
                let fileEle = this.getElementsByTagName('input')[0]
                //    自动触发 file ipnut的点击事件，考虑兼容ie和非ie
                let ie = navigator.appName === 'Microsoft Internet Explorer' ? true : false
                if (ie) {
                    fileEle.click()
                } else {
                    let mouseEv = document.createEvent('MouseEvents')
                    mouseEv.initEvent('click', false, false)
                    fileEle.dispatchEvent(mouseEv)
                }
                fileEle.onchange = function () {
                    let audioFile = this.files[0]
                    // 转换为url
                    let URL = window.URL || window.webkitURL
                    let audioSrc = URL.createObjectURL(audioFile)
                    let obj = {
                        name: audioFile.name,
                        src: audioSrc
                    }
                    localStorage.setItem('ringName', JSON.stringify(obj))
                    caballfun(audioSrc)
                }
            }
        }

        // 用户选择好了铃声之后，使用本地缓存保存铃声，下面是获取本地缓存保存的铃声
        TimeSelect.prototype.getSelectRing = function () {
            return localStorage.getItem('ringName') || this.ringToneAudios[0]
        }

        //时间选择插件的显示和隐藏方法 model-wrap1
        TimeSelect.prototype.show = function () {
            const modelwrap = document.getElementById(this.ele)

            const modelContent = modelwrap.getElementsByClassName('model-content')[0]
            modelwrap.style.display = 'block';
            modelContent.style.animationName = 'showFade'
            modelContent.style.animationFillMode = 'forwards'
            console.log(modelwrap)

        }
        TimeSelect.prototype.hide = function () {
            const modelwrap = document.getElementById(this.ele)
            modelwrap.style.display = 'none';
            // 清空节点


        }
        /**
            * @name: 
            * @description: 用于实现时间选择控件单例创建模式
            * @msg: 
            * @param {type} 
            * @return: 
            */
        function createSingleTimeSlide() {
            let instance = null
            /**
             * @name: 
             * @description: 
             * @msg: 
             * @param {boolean}bol:是否开启单例模式，默认是true，如果是适用于只挂载一个dom节点
             * @param {String}ele:挂载dom节点
             * @param {String}pattern:挂插件时间选中器模式
             * @param {Function}cabll:回调函数
             * @param {Array}extendOptions:扩展功能数组：固定：如下模式：name 以及回调函数
             *  {
                        name: 'ringSelect',
                        cball: function (src) {
                            console.log(src)
                        }
                    }
             * @return: 
             */
            return function (bol, ele, pattern, cabll, extendOptions) {
                if (instance) {
                    return instance
                    cabll(instance.getSelecttime())
                } else {
                    instance = new TimeSelect(ele)
                    let timeObj = instance.getSelecttime()
                    if (pattern === 'hour-second') {
                        // 开启选择闹钟的小时功能
                        instance.setHour('select-hour', function (hourNum) {
                            timeObj.hour = hourNum
                            cabll(hourNum)
                        })

                        // 开启选择闹钟的分钟功能
                        instance.setMinute('select-minute', function (minuteNum) {
                            timeObj.hour = minuteNum
                            cabll(minuteNum)
                        })
                    } else if (pattern === 'hour') {
                        // 开启选择闹钟的小时功能
                        instance.setHour('select-hour', function (hourNum) {
                            timeObj.hour = hourNum
                            cabll(timeObj)
                        })
                    } else {
                        // 开启选择闹钟的分钟功能
                        instance.setMinute('select-minute', function (minuteNum) {
                            timeObj.hour = minuteNum
                            cabll(timeObj)
                        })
                    }
                    //开启扩展功能
                    let obj = {
                        ringSelect: function (ind) {
                            instance.ringTone([], function (src) {
                                extendOptions[ind].cball(src)
                            })
                        }
                    }
                    for (let i = 0; i < extendOptions.length; i++) {
                        const element = extendOptions[i];
                        obj[element.name](i)
                    }

                    return instance
                }

            }



        }
        const createTimeSlider = createSingleTimeSlide()
        return createTimeSlider
})()