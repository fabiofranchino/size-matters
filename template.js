;(function () {
  window.myViz = function init () {
    // private var for config, default values
    var width = 200
    var height = 200
    var padding = {top: 25, bottom: 25, left: 25, right: 25}

    // the build/update function, where all the magic should happen
    function build (selection) {
      selection.each(function (data, index) {
        var element = d3.select(this)

        // useful area
        var innerw = width - padding.left - padding.right
        var innerh = height - padding.top - padding.bottom

        var container = element.selectAll('.mychart')
            .data([null])

        var eContainer = container.enter()
            .append('g')
            .attr('transform', `translate(${padding.left},${padding.top})`)
            .classed('mychart', true)

        container = container.merge(eContainer)

        eContainer.append('g')
            .classed('back', true)
            .append('rect')
            .classed('background', true)

        var back = container.select('.background')

        back
            .attr('width', innerw)
            .attr('height', innerh)

        eContainer.append('g').classed('chart', true)

        /*
            --------------------------------------
            Scale configurations
        */
        var extent = d3.extent(data, d => d)

        var mapx = d3.scaleLinear()
            .domain([0, data.length - 1])
            .range([0, innerw])

        var mapy = d3.scaleLinear()
            .domain(extent)
            .nice()
            .range([innerh, 0])

        /*
            --------------------------------------
            The chart
        */
        var line = d3.line()
            .x((d, i) => mapx(i))
            .y((d, i) => mapy(d))

        eContainer.select('.chart')
            .append('path')
            .classed('line', true)

        container.select('.line')
            .attr('d', line(data))

        /*
            --------------------------------------
            Axis X
        */
        eContainer.append('g').classed('ax x', true)

        var x_axis = d3.axisBottom(mapx)

        container
            .select('.ax.x')
            .attr('transform', `translate(0,${innerh})`)
            .call(x_axis)

        eContainer.append('g').classed('ax y', true)

        /*
            --------------------------------------
            Axis Y
        */
        var y_axis = d3.axisLeft(mapy)

        container
            .select('.ax.y')
            .attr('transform', `translate(0,0)`)
            .call(y_axis)
      })
    }

    // public config function, only public props/functions will be set
    build.width = function (value) {
      if (!arguments.length) return width
      width = value
      return build
    }

    build.height = function (value) {
      if (!arguments.length) return height
      height = value
      return build
    }

    build.padding = function (options) {
      if (!arguments.length) return padding
      for (var k in options) {
        if (padding.hasOwnProperty(k)) {
          padding[k] = options[k]
        }
      }
      return build
    }

    return build
  }
})()
