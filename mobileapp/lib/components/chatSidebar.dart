import 'package:flutter/material.dart';

class ChatSidebar extends StatelessWidget {
  final List<Map<String, String>> previousChats;
  final VoidCallback onClose;
  final Function(String) onChatSelected; // Add this callback

  ChatSidebar({
    required this.previousChats,
    required this.onClose,
    required this.onChatSelected, // Add this parameter
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 300,
      decoration: BoxDecoration(
        color: const Color.fromARGB(255, 236, 231, 202),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.2), // Soft shadow
            spreadRadius: 2,
            blurRadius: 6,
            offset: const Offset(2, 4), // Slight bottom-right shadow
          ),
        ],
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
            height: 590,
            margin: EdgeInsets.all(18.0),
            decoration: BoxDecoration(
              color: const Color.fromARGB(255, 73, 171, 176),
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.2), // Soft shadow
                  spreadRadius: 2,
                  blurRadius: 6,
                  offset: const Offset(2, 4), // Slight bottom-right shadow
                ),
              ],
            ),
            child: Column(
              children: [
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Text(
                    'PREVIOUS CHATS',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.black,
                    ),
                  ),
                ),
                Expanded(
                  child: ListView(
                    children: previousChats.map((chat) {
                      return Padding(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 16.0, vertical: 4.0),
                        child: GestureDetector(
                          onTap: () {
                            // Call the callback with the selected chatId
                            onChatSelected(chat['chatId']!);
                          },
                          child: Container(
                            padding: EdgeInsets.all(8.0),
                            decoration: BoxDecoration(
                              color: const Color.fromARGB(255, 236, 231, 202),
                              borderRadius: BorderRadius.circular(20),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black
                                      .withOpacity(0.2), // Soft shadow
                                  spreadRadius: 2,
                                  blurRadius: 6,
                                  offset: const Offset(
                                      2, 4), // Slight bottom-right shadow
                                ),
                              ],
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text(
                                      chat['date']!,
                                      style: TextStyle(
                                        color: Colors.black,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    Text(
                                      'ID: ${chat['chatId']!}',
                                      style: TextStyle(
                                        color: Colors.black,
                                        fontSize: 12,
                                      ),
                                    ),
                                  ],
                                ),
                                SizedBox(height: 4),
                                Text(
                                  'Student: ${chat['studentId'] ?? "Unknown"}',
                                  style: TextStyle(
                                    color: Colors.black87,
                                    fontSize: 12,
                                  ),
                                ),
                                SizedBox(height: 4),
                                Text(
                                  chat['prompt'] ?? 'No prompt available',
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                  style: TextStyle(
                                    color: Colors.black54,
                                    fontSize: 12,
                                    fontStyle: FontStyle.italic,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
