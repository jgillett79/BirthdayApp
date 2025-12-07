import 'package:flutter/material.dart';

class PeopleListScreen extends StatefulWidget {
  const PeopleListScreen({super.key});

  @override
  State<PeopleListScreen> createState() => _PeopleListScreenState();
}

class _PeopleListScreenState extends State<PeopleListScreen> {
  String? _selectedFilter;
  String _searchQuery = '';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('All People'),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(120),
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(16),
                child: TextField(
                  decoration: InputDecoration(
                    hintText: 'Search people...',
                    prefixIcon: const Icon(Icons.search),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(30),
                    ),
                    filled: true,
                  ),
                  onChanged: (value) {
                    setState(() {
                      _searchQuery = value;
                    });
                  },
                ),
              ),
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Row(
                  children: [
                    _buildFilterChip('All', null),
                    _buildFilterChip('Family', 'FAMILY'),
                    _buildFilterChip('Friends', 'FRIEND'),
                    _buildFilterChip('School', 'SCHOOL'),
                    _buildFilterChip('Work', 'WORK'),
                  ],
                ),
              ),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildPersonTile(
            name: 'Mia Thompson',
            age: 9,
            daysUntil: 3,
            relationship: 'Friend',
            anchor: "Emily's friend",
          ),
          _buildPersonTile(
            name: 'Grandma',
            age: 72,
            daysUntil: 5,
            relationship: 'Family',
            anchor: 'Family',
          ),
          _buildPersonTile(
            name: 'Jack Wilson',
            age: 7,
            daysUntil: 12,
            relationship: 'Friend',
            anchor: "Jack's friend",
          ),
          // Add more mock data
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // TODO: Navigate to add person screen
        },
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildFilterChip(String label, String? value) {
    final isSelected = _selectedFilter == value;
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: FilterChip(
        label: Text(label),
        selected: isSelected,
        onSelected: (selected) {
          setState(() {
            _selectedFilter = selected ? value : null;
          });
        },
      ),
    );
  }

  Widget _buildPersonTile({
    required String name,
    required int age,
    required int daysUntil,
    required String relationship,
    required String anchor,
  }) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        leading: CircleAvatar(
          child: Text(
            name[0],
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
        ),
        title: Text(name),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('$age years old'),
            Text(
              anchor,
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey[600],
              ),
            ),
          ],
        ),
        trailing: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Container(
              padding: const EdgeInsets.symmetric(
                horizontal: 8,
                vertical: 4,
              ),
              decoration: BoxDecoration(
                color: daysUntil <= 7
                    ? Colors.red.shade100
                    : Colors.blue.shade100,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                '$daysUntil days',
                style: TextStyle(
                  fontSize: 12,
                  color: daysUntil <= 7
                      ? Colors.red.shade900
                      : Colors.blue.shade900,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            const SizedBox(height: 4),
            Text(
              relationship,
              style: TextStyle(
                fontSize: 11,
                color: Colors.grey[600],
              ),
            ),
          ],
        ),
        onTap: () {
          // TODO: Navigate to person detail
        },
      ),
    );
  }
}
