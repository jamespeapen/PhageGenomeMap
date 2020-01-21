import re
import json


"""Gene class
@params: locus_tag, gene number, start base number, end base number, product name
"""
class Gene:
    def __init__(self, locus_tag, gene_number, start_location, end_location, length, product):
        self.locus_tag = locus_tag
        self.gene_number = gene_number
        self.start_location = start_location
        self.end_location = end_location
        self.length = length
        self.product = product

    def __str__(self):
        return "gene number: {0}, start: {1}, end: {2}, product: {3}".format(self.gene_number, self.start_location, self.end_location, self.product)


gene_numbers = []  # list to store gene numbers
locus_tags = []  # list to store gene locus tags
start_numbers = []  # gene start base numbers
end_numbers = []  # gene end base numbers
products = []  # protein names

lines = []
filename = input("Enter file path: ")
path = 'gb_files/' + filename

with open(path) as cds:

    for line in cds:
        split_line = re.split('\W+', line.strip())
        lines.append(split_line)
        print(split_line)
    cds.close()

# add cds data to the lists
for line in lines:
    if line[0] == "CDS":
        if line[1] == "complement":
            start_numbers.append(int(line[2]))
            end_numbers.append(int(line[3]))
        else:
            start_numbers.append(int(line[1]))
            end_numbers.append(int((line[2])))

    elif len(line) > 1 and line[1] == "locus_tag":
        locus_tags.append(line[2])

    elif len(line) > 1 and line[1] == "gene":
        gene_numbers.append(line[2])

    elif len(line) > 1 and line[1] == "product":
        product_name=" ".join(line[2:])
        products.append(product_name)

# check that all lists match the number of genes
assert(len(locus_tags) == len(start_numbers) == len(
    end_numbers) == len(gene_numbers) == len(products))
print("Number of genes:")
print(len(locus_tags), len(start_numbers), len(
    end_numbers), len(gene_numbers), len(products))

#make new filename
filename_split=re.split('\W+', filename)
new_filename=filename_split[0] + ".json"
new_path='gene_jsons/' + new_filename

# make a list of gene objects and dump json to file
genes = []
with open(new_path, 'w+') as file:
    for i in range(0, len(gene_numbers)):
        gene=Gene(locus_tags[i], gene_numbers[i], start_numbers[i],
                  end_numbers[i], end_numbers[i] - start_numbers[i], products[i])
        genes.append(gene)

    file.write(json.dumps([gene.__dict__ for gene in genes]))
file.close()
