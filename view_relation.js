var graph = {
    "nodes": [
        { "id": 0, "text": "どこで", "count": 1 }, { "id": 1, "text": "まかせるな", "count": 2 },
        { "id": 2, "text": "漕いで", "count": 4 }, { "id": 3, "text": "その", "count": 4 },
        { "id": 4, "text": "オールを", "count": 2 }, { "id": 5, "text": "全ての", "count": 1 },
        { "id": 6, "text": "手で", "count": 2 }, { "id": 7, "text": "者に", "count": 2 },
        { "id": 8, "text": "なして", "count": 1 }, { "id": 9, "text": "ふらふらと", "count": 1 },
        { "id": 10, "text": "流されまいと", "count": 1 }, { "id": 11, "text": "おまえの", "count": 4 },
        { "id": 12, "text": "消えて", "count": 2 }, { "id": 13, "text": "逆らいながら", "count": 1 },
        { "id": 14, "text": "恐れを", "count": 1 }, { "id": 15, "text": "ゆけ", "count": 4 },
        { "id": 16, "text": "挑み", "count": 1 }, { "id": 17, "text": "ボロボロで", "count": 1 },
        { "id": 18, "text": "傷み", "count": 1 }, { "id": 19, "text": "今", "count": 2 },
        { "id": 20, "text": "逃げ去っても", "count": 1 }, { "id": 21, "text": "船 を", "count": 2 },
        { "id": 22, "text": "喜ぶ", "count": 2 }, { "id": 23, "text": "どこに", "count": 1 },
        { "id": 24, "text": "船は", "count": 4 }, { "id": 25, "text": "浮かんでいるのか", "count": 1 },
        { "id": 26, "text": "おまえが", "count": 2 }, { "id": 27, "text": "進んでいるのか", "count": 1 },
        { "id": 28, "text": "水夫が", "count": 1 }],
    "links": [
        { "source": 3, "target": 21 }, { "source": 3, "target": 24 }, { "source": 21, "target": 2 },
        { "source": 2, "target": 15 }, { "source": 15, "target": 11 }, { "source": 15, "target": 26 },
        { "source": 11, "target": 6 }, { "source": 11, "target": 4 },
        { "source": 6, "target": 2 }, { "source": 26, "target": 12 }, { "source": 12, "target": 22 },
        { "source": 22, "target": 7 }, { "source": 7, "target": 11 }, { "source": 4, "target": 1 },
        { "source": 1, "target": 3 }, { "source": 24, "target": 16 }, { "source": 24, "target": 19 },
        { "source": 24, "target": 18 }, { "source": 19, "target": 23 }, { "source": 19, "target": 0 },
        { "source": 23, "target": 9 }, { "source": 9, "target": 25 }, { "source": 25, "target": 3 },
        { "source": 0, "target": 17 }, { "source": 17, "target": 27 }, { "source": 27, "target": 10 },
        { "source": 10, "target": 13 }, { "source": 13, "target": 24 }, { "source": 16, "target": 24 },
        { "source": 18, "target": 5 }, { "source": 5, "target": 28 }, { "source": 28, "target": 14 },
        { "source": 14, "target": 8 }, { "source": 8, "target": 20 }, { "source": 20, "target": 3 }]
}

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");


//"svg"にZoomイベントを設定
var zoom = d3.zoom()
    .scaleExtent([1 / 4, 4])
    .on('zoom', SVGzoomed);

svg.call(zoom);

//"svg"上に"g"をappendしてdragイベントを設定
var g = svg.append("g")
    .call(d3.drag()
        .on('drag', SVGdragged))

function SVGzoomed() {
    g.attr("transform", d3.event.transform);
}

function SVGdragged(d) {
    d3.select(this).attr('cx', d.x = d3.event.x).attr('cy', d.y = d3.event.y);
};

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink()
        .id(function (d) { return d.id; })
        .distance(100))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

g.append("defs")
    .append("marker")
    .attr("id", "arrow")
    .attr("refX", 5)
    .attr("refY", 5)
    .attr("markerUnits", "strokeWidth")
    .attr("markerWidth", 10)
    .attr("markerHeight", 10)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,0 L5,5 L0,10")
    .attr("stroke", "#999")
    .attr("fill", "none")

var link = g.append("g")
    .selectAll("path")
    .data(graph.links)
    .enter()
    .append("path")
    .attr("marker-end", "url(#arrow)")
    .attr("stroke", "#999")
    .attr("fill", "none")
    .attr("stroke-width", function (d) { return Math.sqrt(d.value); })
    .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

var node = g.append('g')
    .attr('class', 'nodes')
    .selectAll('g')
    .data(graph.nodes)
    .enter()
    .append('g')
    .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

node.append('circle')
    .attr('r', function (d, i) { return getRadius(d.count) })
    .attr('stroke', '#ccc')
    .attr('fill', "#87cefa")
    .style('stroke-width', 'none');

node.append('text')
    .attr('text-anchor', 'middle')
    .attr('fill', 'black')
    .style('pointer-events', 'none')
    .attr('font-size', function (d) { return '10px'; })
    .text(function (d) { return d.text; });

simulation
    .nodes(graph.nodes)
    .on("tick", ticked);

simulation.force("link")
    .links(graph.links);

function ticked() {
    link
        .attr("d", linkArc);
    node
        .attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')' });
}

function linkArc(d) {
    var dx = d.target.x - d.source.x;
    var dy = d.target.y - d.source.y;
    var dr = Math.sqrt(dx * dx + dy * dy);
    var offsetX = (Math.abs(dx) * (getRadius(d.target.count) + 2)) / dr;
    var offsetY = (Math.abs(dy) * (getRadius(d.target.count) + 2)) / dr;
    offsetX = (dx >= 0) ? (0 - offsetX) : offsetX;
    var connectPointX = d.target.x + offsetX;
    offsetY = (dy >= 0) ? (0 - offsetY) : offsetY;
    var connectPointY = d.target.y + offsetY;
    return "M" + d.source.x + "," + d.source.y + " L" + connectPointX + "," + connectPointY;
}

function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

function getRadius(number) {
    return number * 3 + 10;
}

