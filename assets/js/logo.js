/**
 * Adapted from http://vyacheslavryabinin.com/datavis/absind/
 * Original by Vyacheslav Ryabinin (http://vyacheslavryabinin.com)
 */

(function (global) {
  Number.prototype.degsToRads = function () {
    return d3.scale.linear().domain([0, 360]).range([0, 2 * Math.PI])(this)
  }

  var spinningLogo = function (options) {
    var self, center

    function TgpAbsInd(options) {
      this.options = _.extend(TgpAbsInd.defaultOptions, options)
      self = this
    }

    TgpAbsInd.defaultOptions = {
      innerArea: {
        areaSpeed: 0.125,
        circleRadius: 32,
        arcsCount: 3,
        arcsRadius: 12,
        arcsAngularGap: 15,
        arcsPadding: 10,
        glow: {
          innerRadius: 38,
          outerRadius: 62,
          x: 7,
          y: 7
        }
      },
      outerArcs: [
        {
          id: "arc-1",
          speed: -0.05,
          radius: 11,
          distance: 120,
          fill: "rgba(13,215,247,.7)",
          angularSize: 122.6,
          startAngle: 0
        },
        {
          id: "arc-2",
          speed: -0.05,
          radius: 11,
          distance: 120,
          fill: "rgba(13,215,247,.7)",
          angularSize: 20,
          startAngle: -104
        },
        {
          id: "arc-3",
          speed: 0.05,
          radius: 11,
          distance: 120,
          fill: "rgba(13,215,247,.7)",
          angularSize: 20,
          startAngle: -47
        },
        {
          id: "arc-4",
          speed: 0.05,
          radius: 36.6,
          distance: 138.3,
          fill: "rgba(13,215,247,.7)",
          angularSize: 105,
          startAngle: -89.2
        },
        {
          id: "arc-5",
          speed: 0.05,
          radius: 36.6,
          distance: 138.3,
          fill: "rgba(13,215,247,.7)",
          angularSize: 20,
          startAngle: 133
        },
        {
          id: "arc-6",
          speed: -0.05,
          radius: 36.6,
          distance: 138.3,
          fill: "rgba(13,215,247,.7)",
          angularSize: 45,
          startAngle: -94
        },
        {
          id: "arc-7",
          duration: 2700,
          radius: 36.6,
          distance: 120,
          fill: "rgba(237,237,237,.9)",
          angularSize: 60,
          startAngle: 270,
          reverse: false
        },
        {
          id: "arc-8",
          duration: 2700,
          radius: 36.6,
          distance: 120,
          fill: "rgba(237,237,237,.8)",
          angularSize: 80,
          startAngle: 0,
          reverse: true
        },
        {
          id: "arc-9",
          duration: 2700,
          radius: 36.6,
          distance: 120,
          fill: "rgba(237,237,237,.8)",
          angularSize: 90,
          startAngle: 62.5,
          reverse: false
        },
        // Tiny bright arc
        {
          id: "arc-10",
          duration: 2700,
          radius: 36.6,
          distance: 120,
          fill: "rgba(237,237,237,.9)",
          angularSize: 5,
          startAngle: 200,
          reverse: true
        }
      ]
    }

    TgpAbsInd.prototype.paintTo = function (selector) {
      var $e = $(selector), w = $e.width(), h = $e.height()
      var wr = w / 420.0
      center = {x: w / 2, y: h / 2}

      this.svg = d3.select(selector)
        .append("svg")
        .attr("width", '100%')
        .attr("height", '100%')

      // Filters
      this.svg
        .append("defs")
        .append("filter")
        .attr("id", "inner-glow")
        .append("feGaussianBlur")
        .attr("in", "SourceGraphic")
        .attr("stdDeviation", (this.options.innerArea.glow.x * wr) + " " + (this.options.innerArea.glow.y * wr))

      var g = this.svg
        .append("g")

      var innerArea = g.append("g")
        .attr("id", "inner-area")

      // Glowing arc
      innerArea.append("path")
        .attr("id", "inner-glowing-arc")
        .attr("transform", "translate(" + center.x + "," + center.y + ")")
        .attr("d", d3.svg.arc()
            .innerRadius(this.options.innerArea.glow.innerRadius * wr)
            .outerRadius(this.options.innerArea.glow.outerRadius * wr)
            .startAngle(0)
            .endAngle(2 * Math.PI))
        .style("fill", "rgba(13,215,247, .9)")
        .attr("filter", "url(#inner-glow)")

      // Inner circle
      innerArea.append("circle")
        .attr("id", "inner-circle")
        .attr("cx", center.x)
        .attr("cy", center.y)
        .attr("r", this.options.innerArea.circleRadius * wr)
        .style("fill", "rgb(237,237,237)")

      innerArea.append("use")
        .attr("xlink:href", "#inner-circle")
        .attr("filter", "url(#inner-glow)")

      var paddings = this.options.innerArea.arcsCount * self.options.innerArea.arcsAngularGap,
      arcAngularSize = (360 - paddings) / this.options.innerArea.arcsCount

      // Inner surrounding arcs
      var innerArcs = innerArea.append("g")

      innerArcs.selectAll("path")
        .data(d3.range(this.options.innerArea.arcsCount + 1))
        .enter()
        .append("path")
        .style("fill", "rgb(13,215,247)")
        .attr("transform", "translate(" + center.x + "," + center.y + ")" +
              "rotate(" + (180 - self.options.innerArea.arcsAngularGap / 2) + ")")
        .attr("d", function (d, i) {

          var _innerRadius = self.options.innerArea.circleRadius + self.options.innerArea.arcsPadding,
          startAngle = (arcAngularSize * i + self.options.innerArea.arcsAngularGap * (i + 1)).degsToRads(),
          endAngle = arcAngularSize.degsToRads() + startAngle

          return d3.svg.arc()
            .innerRadius(_innerRadius * wr)
            .outerRadius((_innerRadius + self.options.innerArea.arcsRadius) * wr)
            .startAngle(startAngle)
            .endAngle(endAngle)()
        })

      // Outer arcs
      var outerArea = g.append("g")
        .attr("id", "outer-area")

      var outerArcs = outerArea.selectAll("path")
        .data(this.options.outerArcs)
        .enter()
        .append("path")
        .attr("id", function (d) {return d.id;})
        .style("fill", function (d) {return d.fill;})
        .attr("transform", "translate(" + center.x + "," + center.y + ")")
        .attr("d", function (d) {
          var _startAngle = d.startAngle.degsToRads(),
          _angularSize = d.angularSize.degsToRads(),
          _innerRadius = d.distance

          return d3.svg.arc()
            .innerRadius(_innerRadius * wr)
            .outerRadius((_innerRadius + d.radius) * wr)
            .startAngle(_startAngle)
            .endAngle(_startAngle + _angularSize)()
        })

      var t0 = Date.now(),
      noReverseArcs = outerArcs.filter(function (d) { return !('reverse' in d) }),
      t = "translate(" + center.x + "," + center.y + ") "

      function reverseArcTransition(arc, rev) {
        arc.transition()
          .duration(function (d) { return d.duration })
          .ease('linear')
          .attrTween("transform", function (d) {
            return (rev ? d3.interpolate(t + "rotate(" + (d.reverse ? 360 : -360) + ")", t + "rotate(0)")
              : d3.interpolate(t + "rotate(0)", t + "rotate(" + (d.reverse ? 360 : -360) + ")"))
          })
          .each("end", function () {
            d3.select(this).call(reverseArcTransition, rev)
          })
      }

      outerArcs.filter(function (d) { return ('reverse' in d) }).call(reverseArcTransition, false)

      d3.timer(function () {
        var delta = Date.now() - t0

        innerArcs.attr("transform", function () {
          return "rotate(" + delta * self.options.innerArea.areaSpeed +
            "," + center.x + "," + center.y + ")"
        })

        noReverseArcs.attr("transform", function (d) {
          return "translate(" + center.x + "," + center.y + ") rotate(" + delta * d.speed + ")"
        })
      })

      return this
    }

    return new TgpAbsInd(options)
  }

  global.spinningLogo = spinningLogo
  spinningLogo({}).paintTo(".spinning-logo")
})(window)
