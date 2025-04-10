import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class NewsCard extends StatelessWidget {
  final Map<String, dynamic> news;

  NewsCard({required this.news});

  @override
  Widget build(BuildContext context) {
    // Parse the date string into a DateTime object
    DateTime newsDate =
        DateTime.parse(news['newsDate'] ?? DateTime.now().toIso8601String());
    // Format the date and time
    String formattedDate = DateFormat('yyyy-MM-dd – kk:mm').format(newsDate);

    return Container(
      padding: EdgeInsets.all(8.0),
      margin: EdgeInsets.all(8.0),
      decoration: BoxDecoration(
        color: const Color.fromARGB(255, 245, 245, 221),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [BoxShadow(color: Colors.grey, blurRadius: 4)],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(20),
            child: Image.asset(
                news['newsImage'] ?? 'lib/assets/images/default.jpg',
                fit: BoxFit.cover),
          ),
          SizedBox(height: 8.0),
          Text(
            news['newsHeading'] ?? 'No Heading',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          SizedBox(height: 8.0),
          Text(news['newsContent'] ?? 'No Content'),
          SizedBox(height: 8.0),
          Text(
            'Date: $formattedDate',
            style: TextStyle(color: Colors.grey),
          ),
          SizedBox(height: 8.0),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                news['newsType'] ?? 'No Type',
                style: TextStyle(color: Colors.blue),
              ),
              Icon(
                news['stared'] == true ? Icons.star : Icons.star_border,
                color: news['stared'] == true
                    ? const Color.fromARGB(255, 73, 171, 176)
                    : Colors.grey,
              ),
            ],
          ),
          SizedBox(height: 8.0),
          Align(
            alignment: Alignment.bottomRight,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color.fromARGB(255, 73, 171, 176),
              ),
              onPressed: () {
                showModalBottomSheet(
                  context: context,
                  builder: (BuildContext context) {
                    return SingleChildScrollView(
                      child: Container(
                        padding: EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            ClipRRect(
                              borderRadius: BorderRadius.circular(20),
                              child: Image.asset(
                                  news['newsImage'] ??
                                      'lib/assets/images/default.jpg',
                                  fit: BoxFit.cover),
                            ),
                            SizedBox(height: 8.0),
                            Text(
                              news['newsHeading'] ?? 'No Heading',
                              style: TextStyle(
                                  fontSize: 18, fontWeight: FontWeight.bold),
                            ),
                            SizedBox(height: 8.0),
                            Text(news['detailedContent'] ??
                                'No Detailed Content'),
                            SizedBox(height: 8.0),
                            Text(
                              'Date: $formattedDate',
                              style: TextStyle(color: Colors.grey),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                );
              },
              child: Text(
                'Read More',
                style: TextStyle(color: Colors.black),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
