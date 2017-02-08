sap.ui.core.Control.extend('dennisseah.OrgChart', {
    metadata: {
      properties: {
        width: {type: 'int', defaultValue: 1000},
        height: {type: 'int', defaultValue: 800}
      }
    },

    init : function() {
      this.root = {};
    },
    
    setRoot : function(root) {
      this.root = root;
    },

    renderer : function(oRm, oControl) {
      oRm.write('<div');
      oRm.writeControlData(oControl);
      oRm.addClass('dennisseah-orgchart');
      oRm.writeClasses();
      oRm.write('>');
      oRm.write('</div>');
    },

    onAfterRendering: function() {
      var root = this.root;
      var margin = {
        top: 20,
        right: 120,
        bottom: 20,
        left: 120
      };
      var width = this.getWidth() - margin.right - margin.left;
      var height = this.getHeight() - margin.top - margin.bottom;

      var i = 0,
          duration = 750,
          rectW = 250,
          rectH = 250; /* was 50 */

      var tree = d3.layout.tree().nodeSize([70]);
      var diagonal = d3.svg.diagonal()
      .projection(function (d) {
        return [d.x + rectW/2, d.y + rectH/2];
      });

      var svg = d3.select('#' + this.getId())
      .append('svg')
      .attr('width', /*this.getWidth()*/'100%')
      .attr('height', this.getHeight())
      /*.call(zm = d3.behavior.zoom().scaleExtent([1,3])
            .on("zoom", redraw))*/
      .append('g')
      .attr('transform', 'translate(' + (this.getWidth() /2) + ',' + 20 + ')');

      /*zm.translate([50, 20]);*/

      root.x0 = 0;
      root.y0 = height / 2;
      
      function collapse(d) {
        if (d.children) {
          d._children = d.children;
          d._children.forEach(collapse);
          d.children = null;
        }
      }

      root.children.forEach(collapse);
      update(root);
      d3.select('#' + this.getId()).style('height', '800px');

      function update(source) {
        var nodes = tree.nodes(root).reverse(),
            links = tree.links(nodes);

        nodes.forEach(function (d) {
          d.y = d.depth * 180;
        });

        var node = svg.selectAll('g.node')
        .data(nodes, function (d) {
          return d.id || (d.id = ++i);
        });

        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append('g')
        .attr('class', 'node')
        .attr('transform', function (d) {
          return 'translate(' + source.x0 + ',' + source.y0 + ')';
        })
        .on('click', click);

        nodeEnter.append('rect')
        .attr('width', rectW)
        .attr('height', rectH)
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .attr('rx', 250) /* was 25 */
        .attr('ry', 250) /* was 25 */
        .style('fill', function (d) {
          return d._children ? '#85ff77' : '#fff';
        });

        nodeEnter.append('text')
        .attr('x', rectW / 2)
        .attr('y', rectH / 2)
        .attr('dy', '.35em')
        .attr('text-anchor', 'middle')
        .text(function (d) {
          return d.name;
        });

        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
        .duration(duration)
        .attr('transform', function (d, i) {
          return 'translate(' + (d.x*4) + ',' + d.y + ')';
        });

        nodeUpdate.select('rect')
        .attr('width', rectW)
        .attr('height', rectH)
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .style('fill', function (d) {
          return d._children ? '#85ff77' : '#fff';
        });

        nodeUpdate.select('text')
        .style('fill-opacity', 1);

        // Transition exiting nodes to the parent's new position.
        var nodeExit = node.exit().transition()
        .duration(duration)
        .attr('transform', function (d) {
          return 'translate(' + source.x + ',' + source.y + ')';
        })
        .remove();

        nodeExit.select('rect')
        .attr('width', rectW)
        .attr('height', rectH)
        .attr('stroke', 'black')
        .attr('stroke-width', 1);
        nodeExit.select('text');

        // Update the links…
        var link = svg.selectAll('path.link')
        .data(links, function (d) {
          return d.target.id;
        });

        // Enter any new links at the parent's previous position.
        link.enter().insert('path', 'g')
        .attr('class', 'link')
        .attr('x', rectW/2)
        .attr('y', rectH / 2)
/* *************** Path Lines *************** */
        /*.attr("d", function (d) {
          var o = {
            x: source.x0,
            y: source.y0
          };
          return diagonal({
            source: o,
            target: o
          });
        })*/;

        // Transition links to their new position.
        link.transition()
        .duration(duration)
        /*.attr("d", diagonal);*/   

/* *************** Path Lines *************** */     

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
        .duration(duration)
        .attr('d', function (d) {
          var o = {
            x: source.x,
            y: source.y
          };
          return diagonal({
            source: o,
            target: o
          });
        })
        .remove();

        // Stash the old positions for transition.
        nodes.forEach(function (d) {
          d.x0 = d.x;
          d.y0 = d.y;
        });
      }

      // Toggle children on click.
      function click(d) {
        if (d.children) {
          d._children = d.children;
          d.children = null;
        } else {
          d.children = d._children;
          d._children = null;
        }
        update(d);
      }

      //Redraw for zoom
      function redraw() {
        //console.log("here", d3.event.translate, d3.event.scale);
        svg.attr('transform',
                 'translate(' + d3.event.translate + ')'
                 + ' scale(' + d3.event.scale + ')');
      }
    }
  });
  
  
  			           
  var org_chart = new dennisseah.OrgChart();
  org_chart.setRoot({
    name: 'Experience',
    children: [
      {name: 'ROAR! Internet Marketing', children : [
        {name:'Responsive Conversion'},
        {name:'ASP.NET Updates'},
        {name:'MailChimp Emails'},
      ]
      },
      {name: 'On Target Web Solutions', children : [
        {name:'Wordpress Updates'},
        {name:'Custom Themes'},
        {name:'Infographics'},
      ]
  	  },
    ]
  });
  org_chart.placeAt('content');