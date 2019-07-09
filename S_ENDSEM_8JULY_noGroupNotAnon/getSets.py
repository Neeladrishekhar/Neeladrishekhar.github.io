import os
def get_immediate_subdirectories(a_dir):
	return [name for name in os.listdir(a_dir) if os.path.isdir(os.path.join(a_dir, name))]

CSV = ''

for Question in get_immediate_subdirectories('.'):
	match_sets = []
	roll_looks = {}
	mossID = get_immediate_subdirectories('./'+Question+'/moss.stanford.edu/results')
	with open('./'+Question+'/moss.stanford.edu/results/'+mossID[0]+'.html') as f:
		first = True
		roll_first = ''
		roll_secnd = ''
		for line in f:
			if line[:17] == '<TR><TD><A HREF="':
				if first:
					first = False
					start_pos = 17;
					while not line[start_pos-1] == '>':
						start_pos += 1
					roll_first = line[start_pos:start_pos+9]
				else:
					print('Mis-matching pairs OR pairs not yet ended')
					exit(0)
			if line[:17] == '    <TD><A HREF="':
				if not first:
					first = True
					start_pos = 17;
					while not line[start_pos-1] == '>':
						start_pos += 1
					roll_secnd = line[start_pos:start_pos+9]

					if roll_first in roll_looks.keys():
						if roll_secnd in roll_looks.keys():
							merge_to = roll_looks[roll_first]; merge_from = roll_looks[roll_secnd]
							if not merge_to == merge_from:
								if len(match_sets[merge_to]) < len(match_sets[merge_from]):
									merge_from = merge_to; merge_to = roll_looks[roll_secnd]
								for roll_move in match_sets[merge_from]:
									match_sets[merge_to].append(roll_move)
									roll_looks[roll_move] = merge_to;
								match_sets[merge_from] = []
						else:
							roll_looks[roll_secnd] = roll_looks[roll_first]
							match_sets[roll_looks[roll_first]].append(roll_secnd)
					else:
						if roll_secnd in roll_looks.keys():
							roll_looks[roll_first] = roll_looks[roll_secnd]
							match_sets[roll_looks[roll_secnd]].append(roll_first)
						else:
							roll_looks[roll_first] = len(match_sets)
							roll_looks[roll_secnd] = len(match_sets)
							match_sets.append([roll_first, roll_secnd])

				else:
					print('Mis-matching pairs OR pairs not yet started')
					exit(0)
	mossLink = ''
	if os.path.exists('./'+Question+'/mossResults.txt'):
		with open('./'+Question+'/mossResults.txt') as f:
			for line in f:
				if line[:4] == "http":
					mossLink = line; break;
	else:
		mossLink = 'https://cse.iitb.ac.in/~cs101/'+os.getcwd().split(os.sep)[-1]+'/'+Question+'/moss.stanford.edu/results/'+mossID[0]+'.html'

	CSV += Question+"\n,Original,"+mossLink+"\n,Anonymous\n"
	i = 0
	for sets in match_sets:
		if len(sets) > 0:
			i += 1
			CSV += "Set "+str(i)+"\n"
			for roll in sets:
				CSV += ","+roll+"\n"
	CSV += "\n"

f= open("mossInterprets.csv","w+")
f.write(CSV)
f.close()