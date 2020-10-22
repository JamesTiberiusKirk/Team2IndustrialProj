import pandas as pd
import re
import sys

file_in = open(sys.argv[1], encoding="UTF-8")
file_out = open(sys.argv[1]+"-questions.sql", 'w')

q_regex = re.compile(r'#Q [A-Za-z.?!]*')
a_regex = re.compile(r'[A-D]{1} [A-Za-z.!]*')
ca_regex = re.compile(r'[\^]{1} [A-Za-z.!]*')

question = ''
q_valid = True
answers = [None] * 4
num_answers = 0
correct_answer = ''
correct_answer_index = -1

while True:

    # needs try as some lines have characters which throw decode errors
    try:
        line = file_in.readline()
    except:
        q_valid = False
        continue
        
    # detects the end of the file
    if not line:
        break

    # line is a question
    if q_regex.match(line):
        question = line[3:]
        q_valid = True
        answers = [None] * 4
        num_answers = 0
        correct_answer = ''
        correct_answer_index = -1
        
        # checks if Question potion of the line is the correct size for the 
        if len(line[3:]) > 256:
            q_valid = False
            
    # line indicates a correct answer
    elif ca_regex.match(line) and q_valid:
        correct_answer = line[2:]
        
    # line indicates an answer option
    elif a_regex.match(line) and q_valid:
        if num_answers < 4:
            answers[num_answers] = line[2:]
            if answers[num_answers] == correct_answer:
                correct_answer_index = num_answers
            num_answers += 1
            
            # if the answer is too long the whole question is skipped
            if len(line[2:]) > 256:
                q_valid = False
                
        # if there is already 4 answers and none match the correct answer for this question, the question is skipped
        elif correct_answer_index == -1:
            q_valid = False
            
    # the line is blank
    elif line == '':
        continue
        
    # if none of the above then the line is invalid and the current question is skipped
    else:
        q_valid = False

    # when finished parsing the question the mysql query to add it to the db is constructed
    if q_valid and num_answers == 4 and correct_answer_index != -1:
        print('valid question found')
        answer_value_sql = 'INSERT INTO `answer` (`text`,`question_id`,`correct`) VALUES '
        for i in range(4):
            answer_value_sql += "('" + answers[i][:-1] + "',LAST_INSERT_ID(),"
            if correct_answer_index == i:
                answer_value_sql += '1'
            else:
                answer_value_sql += '0'
            answer_value_sql += ')'
            if i < 3:
                answer_value_sql += ', '

        file_out.writelines([str("INSERT INTO `question` (`text`,`category_id`) VALUES ('" + question[:-1] + "',1);\n"),
                             str(answer_value_sql + ';\n')])
        q_valid = False

# file streams closed
file_in.close()
file_out.close()



