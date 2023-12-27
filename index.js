
var xhr = new XMLHttpRequest();
const $chartContainer = document.getElementById('chart')
xhr.open("GET", "http://192.168.1.102:8080/android", true);
xhr.setRequestHeader("Content-Type", "application/json");
xhr.onreadystatechange = function () {
    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) {
            return;
        }
        if (xhr.status === 200) {
            var result = JSON.parse(xhr.responseText);
            var array = [];
            for (var i = 0; i < result.length; i++) {
                var userHealth = new UserHealthDTO(result[i].id, result[i].headAche, result[i].pressure, result[i].userId, result[i].date);
                array.push(userHealth);
            }
            const data = [
                {
                    x: '2010',
                    y: 10,
                },
                {
                    x: '2011',
                    y: 15,
                },
                {
                    x: '2012',
                    y: 13,
                },
                {
                    x: '2013',
                    y: 17,
                },
                {
                    x: '2015',
                    y: 25,
                },
            ]
            new LineChart(data, $chartContainer).create()
        } else {
            console.log('err', xhr.responseText);
        }
    }
};
xhr.send();

class Chart {
    createSvgElement(tagName) {
        return document.createElementNS('http://www.w3.org/2000/svg', tagName)
    }
    setAttribute($svgElement, attributesOdject) {
        Object.keys(attributesOdject).forEach(key => {
            $svgElement.setAttribute(key, attributesOdject[key])
        })
    }
}

class LineChart extends Chart {
    horizontalPadding = 30
    bottomPadding = 30
    topYPadding = 30
    chartLineStrokeWidth = 5
    circleRadius = 6

    constructor(data, $container) {
        super();
        this.data = data;
        this.$container = $container;

        this.maxWidth = this.$container.offsetWidth;
        this.maxHeight = this.$container.offsetHeight;

        this.maxChartWidth = this.maxWidth - this.horizontalPadding * 3
        this.maxChartHeight = this.maxHeight - this.bottomPadding - this.topYPadding

        this.maxY = Math.max(...data.map(el => el.y))
        this.minY = Math.min(...data.map(el => el.y))
        this.zoom = this.maxChartHeight / (this.maxY - this.minY)
        if (this.zoom < 0) {
            this.zoom = 1 + this.zoom
        }
        if (!isFinite(this.zoom)) {
            this.zoom = 1;
        }
        console.log(this.zoom)
    }

    createChartLine() {
        const $chartLine = this.createSvgElement('path')
        this.setAttribute($chartLine, {
            stroke: '#FF5D5B',
            'stroke-width': this.chartLineStrokeWidth,
            fill: 'none',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round'
        })
        return $chartLine
    }
    createAxisXSeparator() {
        const $axisXLine = this.createSvgElement('line')
        this.setAttribute($axisXLine, {
            x1: 0,
            x2: this.maxWidth,
            y1: this.maxChartHeight + this.topYPadding + this.chartLineStrokeWidth,
            y2: this.maxChartHeight + this.topYPadding + this.chartLineStrokeWidth,
            stroke: 'black',
            'stroke-width': 1
        })
        return $axisXLine

    }

    creatTicks() {
        const heightPerTick = 90
        const ticksCount = this.maxChartHeight / heightPerTick
        const tickAdd = (this.maxY - this.minY) / ticksCount
        const $ticks = []
        let tickValue = this.maxY

        for (let i = 0; i < ticksCount; i++) {
            const currentY = heightPerTick * i + this.topYPadding - this.circleRadius
            const $tick = this.createSvgElement('line')
            this.setAttribute($tick, {
                x1: this.horizontalPadding,
                x2: this.maxChartWidth + this.horizontalPadding,
                y1: currentY,
                y2: currentY,
                'stroke-width': 0.5,
                stroke: '#FF6347'
            })
            const $text = this.createSvgElement('text')
            this.setAttribute($text, {
                x: this.maxWidth - this.horizontalPadding,
                y: currentY,
            })
            $text.append(tickValue.toFixed(1))

            $ticks.push($tick, $text)
            tickValue -= tickAdd
        }
        return $ticks
    }
    createCircle(el, x, y) {
        const $circle = this.createSvgElement('circle')
        this.setAttribute($circle, {
            r: this.circleRadius,
            cx: x,
            cy: y,
            fill: '#FF5D5B',
            stroke: 'rgba(255, 160, 170, 0.5)'
        })
        $circle.dataset.text = `x: ${el.x}, y: ${el.y}`
        $circle.classList.add('circle')
        $circle.dataset.circle = 'true'
        return $circle
    }
    onCircleOver($circle) {
        const $tooltip = document.createElement('div')
        $tooltip.textContent = $circle.dataset.text
        $tooltip.classList.add('tooltip')
        $circle.setAttribute('stroke-width', 15)
        const popperElement = Popper.createPopper($circle, $tooltip)
        $circle.onmouseout = () => {
            $tooltip.remove()
            $circle.setAttribute('stroke-width', 0)
            $circle.onmouseout = null
        }
        this.$container.appendChild($tooltip)
    }

    create() {
        const $svg = this.createSvgElement('svg');
        this.setAttribute($svg, {
            width: '100%',
            height: '100%',
            viewBox: `0 0 ${this.maxWidth} ${this.maxHeight}`
        })

        const $chartLine = this.createChartLine()
        const $ticks = this.creatTicks()
        const $bottomXLine = this.createAxisXSeparator()

        const lineLength = this.maxChartWidth / (this.data.length - 1)
        const yShift = this.minY * this.zoom

        $svg.append(...$ticks, $chartLine, $bottomXLine)
        let d = 'M'
        let currentX = 0 + this.horizontalPadding

        this.data.forEach((el, i) => {
            const x = currentX
            const y = this.maxChartHeight - el.y * this.zoom + yShift + this.topYPadding - this.circleRadius
            d += `${x} ${y} L `

            const $circle = this.createCircle(el, x, y)
            const $bottomXText = this.createSvgElement('text')
            this.setAttribute($bottomXText, {
                x: currentX,
                y: this.maxHeight - 5
            })
            $bottomXText.append(el.x)

            $svg.append($circle, $bottomXText)

            currentX += lineLength
        })
        d = d.slice(0, -3)

        $chartLine.setAttribute('d', d)


        this.$container.appendChild($svg)

        $svg.onmouseover = (e) => {
            if (e.target.dataset.circle) {
                this.onCircleOver(e.target)
            }
        }

        return this
    }
}


