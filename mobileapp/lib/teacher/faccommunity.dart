import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;
import '../components/teacherheader.dart';
import '../components/footer.dart';
import '../components/faccard.dart';

class FacCommunityLanding extends StatefulWidget {
  @override
  State<FacCommunityLanding> createState() => _LandingPageState();
}

class _LandingPageState extends State<FacCommunityLanding> {
  int _selectedIndex = 0;
  List<dynamic> _posts = [];
  List<dynamic> _filteredPosts = [];
  TextEditingController _searchController = TextEditingController();
  String _searchQuery = "";

  @override
  void initState() {
    super.initState();
    _loadPosts();
    _searchController.addListener(_onSearchChanged);
  }

  @override
  void dispose() {
    _searchController.removeListener(_onSearchChanged);
    _searchController.dispose();
    super.dispose();
  }

  void _loadPosts() async {
    final String response =
        await rootBundle.loadString('lib/data/community.json');
    final data = await json.decode(response);
    setState(() {
      _posts = data;
      _filteredPosts = _posts;
    });
  }

  void _onSearchChanged() {
    setState(() {
      _searchQuery = _searchController.text;
      _filteredPosts = _posts
          .where((post) => post['question']
              .toLowerCase()
              .contains(_searchQuery.toLowerCase()))
          .toList();
    });
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });

    // Navigate to different pages based on index
    switch (index) {
      case 0:
        Navigator.pushNamed(context, '/teacherhome');
        break;
      case 1:
        Navigator.pushNamed(context, '/teacherassignment');
        break;
      case 2:
        Navigator.pushNamed(context, '/teachercommunity');
        break;
      case 3:
        Navigator.pushNamed(context, '/teacherai');
        break;
      case 4:
        Navigator.pushNamed(context, '/teacherresources');
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFE195AB),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(4.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: TeacherHeader(
                  onProfileTap: () {
                    Navigator.pushNamed(context, '/teacherprofile');
                  },
                  onNotificationTap: () {
                    Navigator.pushNamed(context, '/notifications');
                  },
                  profileImage: 'assets/images/teacher.png',
                  welcomeText: "WELCOME HASHIM",
                ),
              ),
              const SizedBox(height: 40),
              Container(
                padding: EdgeInsets.fromLTRB(10.0, 12.0, 10.0, 12.0),
                decoration: BoxDecoration(
                  color: const Color.fromARGB(255, 236, 231, 202),
                  borderRadius: BorderRadius.circular(30),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      margin: EdgeInsets.fromLTRB(20.0, 10.0, 0.0, 0.0),
                      child: Row(
                        children: [
                          SizedBox(
                            width: 30,
                            height: 30,
                            child: IconButton(
                              onPressed: () {
                                Scaffold.of(context).openDrawer();
                              },
                              icon: Icon(Icons.menu, size: 30),
                              padding: EdgeInsets.zero,
                              constraints: BoxConstraints(),
                            ),
                          ),
                          const SizedBox(width: 140),
                          Container(
                            width: 180,
                            height: 40,
                            padding: EdgeInsets.fromLTRB(12.0, 2.0, 4.0, 2.0),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Row(
                              children: [
                                Expanded(
                                  child: TextField(
                                    controller: _searchController,
                                    decoration: InputDecoration(
                                      hintText: "Search",
                                      border: InputBorder.none,
                                    ),
                                  ),
                                ),
                                Icon(Icons.search, size: 30),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 10),
                    const SizedBox(height: 15),
                    Container(
                      padding: EdgeInsets.fromLTRB(15.0, 0.0, 0.0, 0.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            "WELCOME TO COMMUNITY",
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.w100,
                            ),
                          ),
                          Text(
                            "Recommended for you",
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w100,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 15),
                    ..._filteredPosts
                        .map((post) => FacPostCard(
                              question: post['question'],
                              frequentAnswers: List<Map<String, dynamic>>.from(
                                  post['frequentAnswers']),
                              subjectOrBookName: post['subjectOrBookName'],
                              upvotes: post['upvotes'],
                              downvotes: post['downvotes'],
                              onAnswer: () {
                                // Handle answer action
                              },
                              onUpvote: () {
                                // Handle upvote action
                              },
                              onDownvote: () {
                                // Handle downvote action
                              },
                              onViewAnswers: () {
                                // Handle view answers action
                              },
                            ))
                        .toList(),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: Footer(
        selectedIndex: _selectedIndex,
        onItemTapped: _onItemTapped,
      ),
    );
  }
}
