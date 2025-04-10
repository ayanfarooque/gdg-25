import 'package:flutter/material.dart';

class PostCard extends StatelessWidget {
  final String question;
  final List<Map<String, dynamic>> frequentAnswers;
  final String subjectOrBookName;
  final int upvotes;
  final int downvotes;
  final VoidCallback onAnswer;
  final VoidCallback onUpvote;
  final VoidCallback onDownvote;
  final VoidCallback onViewAnswers;

  const PostCard({
    Key? key,
    required this.question,
    required this.frequentAnswers,
    required this.subjectOrBookName,
    required this.upvotes,
    required this.downvotes,
    required this.onAnswer,
    required this.onUpvote,
    required this.onDownvote,
    required this.onViewAnswers,
  }) : super(key: key);

  void _showAnswersModal(BuildContext context) {
    showModalBottomSheet(
      context: context,
      builder: (BuildContext context) {
        return Container(
          padding: EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Frequent Answers',
                style: TextStyle(
                  fontSize: 18.0,
                  fontWeight: FontWeight.bold,
                  color: Colors.black87,
                ),
              ),
              const SizedBox(height: 20.0),
              Expanded(
                child: ListView.builder(
                  itemCount: frequentAnswers.length,
                  itemBuilder: (context, index) {
                    final answer = frequentAnswers[index];
                    return ListTile(
                      title: Text(
                        answer['answer'],
                        style: TextStyle(
                          fontSize: 12.0,
                          color: Colors.black87,
                        ),
                      ),
                      trailing: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          IconButton(
                            icon: Icon(Icons.thumb_up, color: Colors.green),
                            onPressed: () {
                              // Handle upvote action for the answer
                            },
                          ),
                          Text('${answer['upvotes']}',
                              style: TextStyle(fontSize: 12.0)),
                          IconButton(
                            icon: Icon(Icons.thumb_down, color: Colors.red),
                            onPressed: () {
                              // Handle downvote action for the answer
                            },
                          ),
                          Text('${answer['downvotes']}',
                              style: TextStyle(fontSize: 12.0)),
                        ],
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.all(5.0),
      decoration: BoxDecoration(
        color: const Color.fromARGB(255, 245, 245, 221),
        borderRadius: BorderRadius.circular(10.0),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.5),
            spreadRadius: 2,
            blurRadius: 5,
            offset: Offset(0, 3),
          ),
        ],
      ),
      child: Card(
        color: Colors.transparent,
        elevation: 0.0,
        margin: EdgeInsets.all(10.0),
        child: Padding(
          padding: EdgeInsets.all(10.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                question,
                style: TextStyle(
                  fontSize: 14.0,
                  fontWeight: FontWeight.bold,
                  fontFamily: 'CustomFont',
                ),
              ),
              SizedBox(height: 10.0),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    subjectOrBookName,
                    style: TextStyle(
                      fontSize: 12.0,
                      fontWeight: FontWeight.bold,
                      color: Colors.red,
                      fontFamily: 'CustomFont',
                    ),
                  ),
                  ElevatedButton(
                    style: TextButton.styleFrom(
                      backgroundColor: const Color.fromARGB(255, 73, 171, 176),
                    ),
                    onPressed: onAnswer,
                    child: Text(
                      'Answer',
                      style: TextStyle(
                        color: Colors.black,
                        fontFamily: 'CustomFont',
                        fontSize: 12.0,
                      ),
                    ),
                  ),
                ],
              ),
              SizedBox(height: 10.0),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [],
              ),
              SizedBox(height: 10.0),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      IconButton(
                        icon: Icon(Icons.thumb_up, color: Colors.green),
                        onPressed: onUpvote,
                      ),
                      Text('$upvotes', style: TextStyle(fontSize: 14.0)),
                      IconButton(
                        icon: Icon(Icons.thumb_down, color: Colors.red),
                        onPressed: onDownvote,
                      ),
                      Text('$downvotes', style: TextStyle(fontSize: 14.0)),
                    ],
                  ),
                  TextButton.icon(
                    onPressed: () => _showAnswersModal(context),
                    icon: Icon(Icons.comment, color: Colors.blue),
                    label: Text(
                      'View Answers',
                      style: TextStyle(fontSize: 14.0),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
