import os
import spacy
import ginza
import json
from collections import defaultdict

nlp = spacy.load('ja_ginza')


def prepare(text):
    table = str.maketrans({
        '\u3000': os.linesep,
        '\t': os.linesep
    })
    text = text.translate(table)
    return text


def remove_linesep(str_list):
    return list(map(lambda e: e.replace(os.linesep, ""), str_list))


def get_links(bunsetu, bid_table):
    links = []
    link_table = defaultdict(lambda: [])
    link_count = defaultdict(lambda: 0)
    for idx in range(0, len(bunsetu)-1, 1):
        current = bunsetu[idx]
        next = bunsetu[idx + 1]
        link_table[current].append(next)
    for key, value in link_table.items():
        for v in list(set(value)):
            link = {}
            src_id = bid_table[key]
            tgt_id = bid_table[v]
            link["source"] = src_id
            link["target"] = tgt_id
            link_count[src_id] += 1
            link_count[tgt_id] += 1
            links.append(link)
    return links, link_count


def get_nodes(link_count, bid_table):
    nodes = []
    for key, value in bid_table.items():
        node = {}
        node["id"] = value
        node["text"] = key
        node["count"] = link_count[value]
        nodes.append(node)
    return nodes


if __name__ == '__main__':
    input_file = open("sorahune_short.txt", "r")
    input_text = input_file.read()
    input_file.close()

    input_text = prepare(input_text)
    doc = nlp(input_text)
    bunsetu = [b.text for b in ginza.bunsetu_spans(doc)]
    bunsetu = remove_linesep(bunsetu)

    uni_bunsetu = list(set(bunsetu))
    bid_table = {}
    for idx, b in enumerate(uni_bunsetu):
        bid_table[b] = idx

    links, link_count = get_links(bunsetu, bid_table)
    nodes = get_nodes(link_count, bid_table)

    graph = {"nodes": nodes,
             "links": links}
    print(graph)
