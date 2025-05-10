import 'package:flutter/material.dart';

class TeacherFooter extends StatelessWidget {
  final int selectedIndex;
  final Function(int) onItemTapped;

  const TeacherFooter({
    Key? key,
    required this.selectedIndex,
    required this.onItemTapped,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Create a list with only the visible items
    final visibleItems = [
      const BottomNavigationBarItem(
        icon: Icon(Icons.home),
        label: 'Home',
      ),
      const BottomNavigationBarItem(
        icon: Icon(Icons.people),
        label: 'Community',
      ),
      const BottomNavigationBarItem(
        icon: Icon(Icons.chat_bubble),
        label: 'AI Assistant',
      ),
      const BottomNavigationBarItem(
        icon: Icon(Icons.book),
        label: 'Resource',
      ),
      const BottomNavigationBarItem(
        icon: Icon(Icons.school),
        label: 'Classes',
      ),
    ];

    // Calculate the adjusted index for display
    int displayIndex = selectedIndex;
    if (selectedIndex > 0) {
      displayIndex = selectedIndex - 1; // Skip the hidden index
    }

    return BottomNavigationBar(
      type: BottomNavigationBarType.fixed,
      items: visibleItems,
      currentIndex: displayIndex < visibleItems.length ? displayIndex : 0,
      selectedItemColor: const Color(0xFF49ABB0),
      unselectedItemColor: Colors.grey,
      onTap: (index) {
        // Adjust the index for the callback to maintain compatibility
        // with the existing code structure
        if (index >= 1) {
          onItemTapped(index + 1); // Add 1 to account for the hidden item
        } else {
          onItemTapped(index); // Index 0 remains the same
        }
      },
      showSelectedLabels: true,
      showUnselectedLabels: true,
    );
  }
}
