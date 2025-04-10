import 'package:flutter/material.dart';

class AssignmentSidebar extends StatelessWidget {
  final List<Map<String, String>> pendingAssignments;
  final List<Map<String, String>> submittedAssignments;
  final VoidCallback onClose;

  AssignmentSidebar({
    required this.pendingAssignments,
    required this.submittedAssignments,
    required this.onClose,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 300,
      decoration: BoxDecoration(
        color: const Color.fromARGB(255, 236, 231, 202),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(
              height: 60), // Adjust this value to match the header height
          Align(
            alignment: Alignment.topRight,
            child: IconButton(
              icon: Icon(Icons.close),
              onPressed: onClose,
            ),
          ),
          Container(
            height: 290,
            width: 400,
            margin: EdgeInsets.all(18.0),
            decoration: BoxDecoration(
              color: const Color.fromARGB(255, 73, 171, 176),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Column(
              children: [
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Text(
                    'PENDING ASSIGNMENTS',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ),
                ...pendingAssignments.map((assignment) {
                  return Padding(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 16.0, vertical: 4.0),
                    child: GestureDetector(
                      onTap: () {
                        // Navigate to submission page
                      },
                      child: Container(
                        padding: EdgeInsets.all(8.0),
                        width: 300,
                        decoration: BoxDecoration(
                          color: Colors.red,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              children: [
                                Text(
                                  assignment['subjectCode']!,
                                  style: TextStyle(color: Colors.black),
                                ),
                              ],
                            ),
                            Row(
                              children: [
                                Text(
                                  assignment['date']!,
                                  style: TextStyle(color: Colors.black),
                                ),
                              ],
                            )
                          ],
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ],
            ),
          ),

          Container(
            width: 400,
            height: 300,
            margin: EdgeInsets.all(18.0),
            decoration: BoxDecoration(
              color: const Color.fromARGB(255, 73, 171, 176),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Column(
              children: [
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Text(
                    'SUBMITTED ASSIGNMENTS',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ),
                ...submittedAssignments.map((assignment) {
                  return Padding(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 16.0, vertical: 4.0),
                    child: GestureDetector(
                      onTap: () {
                        // Open assignment details
                      },
                      child: Container(
                        padding: EdgeInsets.all(8.0),
                        decoration: BoxDecoration(
                          color: const Color(0xFF004D40),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              assignment['date']!,
                              style: TextStyle(color: Colors.white),
                            ),
                            Text(
                              assignment['subjectCode']!,
                              style: TextStyle(color: Colors.white),
                            ),
                            Text(
                              assignment['assignmentId']!,
                              style: TextStyle(color: Colors.white),
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
