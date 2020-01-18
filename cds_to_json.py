import re
import json


class Gene:
    def __init__(self, start_location, end_location, gene_number, product):
        self.start_location = start_location
        self.end_location = end_location
        self.gene_number = gene_number
        self.product = product

    def __str__(self):
        return "gene number: {0}, start: {1}, end: {2}, product: {3}".format(self.gene_number, self.start_location, self.end_location, self.product)


lines = []

gene_numbers = []
start_numbers = []
end_numbers = []
products = []

# start_location, end_location, gene_number = 0
# product = ''

with open("Barb_flat.cds") as cds:

    for line in cds:
        split_line = re.split('\W+', line.strip())
        lines.append(split_line)
        print(split_line)

for line in lines:
    if line[0] == "CDS":
        if line[1] == "complement":
            start_numbers.append(line[2])
            end_numbers.append(line[3])
        else:
            start_numbers.append(line[1])
            end_numbers.append(line[2])

    elif len(line) > 1 and line[1] == "gene":
        gene_numbers.append(line[2])

    elif len(line) > 1 and line[1] == "product":
        product_name = " ".join(line[2:])
        products.append(product_name)


print(len(start_numbers), len(end_numbers), len(gene_numbers), len(products))

genes = []
for i in range(0, 98):
    gene = Gene(start_numbers[i], end_numbers[i], gene_numbers[i], products[i])
    genes.append(gene)

for gene in genes:
    print(gene)
