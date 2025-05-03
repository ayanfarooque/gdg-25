import 'package:flutter/material.dart';

class Footer extends StatelessWidget {
  final int selectedIndex;
  final Function(int) onItemTapped;

  const Footer({
    Key? key,
    required this.selectedIndex,
    required this.onItemTapped,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BottomNavigationBar(
      type: BottomNavigationBarType.fixed,
      items: const <BottomNavigationBarItem>[
        BottomNavigationBarItem(
          icon: Icon(Icons.home),
          label: 'Home',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.assignment),
          label: 'Assignments',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.people),
          label: 'Community',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.chat_bubble),
          label: 'AI Bot',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.book),
          label: 'Resources',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.school),
          label: 'Classroom',
        ),
      ],
      currentIndex: selectedIndex,
      selectedItemColor: const Color(0xFF49ABB0),
      unselectedItemColor: Colors.grey,
      onTap: onItemTapped,
    );
  }
}
