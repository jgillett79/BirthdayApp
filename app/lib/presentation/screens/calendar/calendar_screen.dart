import 'package:flutter/material.dart';
import 'package:table_calendar/table_calendar.dart';

class CalendarScreen extends StatefulWidget {
  const CalendarScreen({super.key});

  @override
  State<CalendarScreen> createState() => _CalendarScreenState();
}

class _CalendarScreenState extends State<CalendarScreen> {
  DateTime _focusedDay = DateTime.now();
  DateTime? _selectedDay;

  // Mock birthday data - replace with actual data
  final Map<DateTime, List<String>> _birthdays = {
    DateTime(2025, 12, 10): ['Mia Thompson'],
    DateTime(2025, 12, 12): ['Grandma'],
    DateTime(2025, 12, 19): ['Jack Wilson'],
  };

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Calendar'),
      ),
      body: Column(
        children: [
          TableCalendar(
            firstDay: DateTime.utc(2020, 1, 1),
            lastDay: DateTime.utc(2030, 12, 31),
            focusedDay: _focusedDay,
            selectedDayPredicate: (day) => isSameDay(_selectedDay, day),
            calendarFormat: CalendarFormat.month,
            startingDayOfWeek: StartingDayOfWeek.monday,
            eventLoader: (day) {
              final normalizedDay = DateTime(day.year, day.month, day.day);
              return _birthdays[normalizedDay] ?? [];
            },
            calendarStyle: CalendarStyle(
              markersMaxCount: 1,
              markerDecoration: BoxDecoration(
                color: Theme.of(context).colorScheme.primary,
                shape: BoxShape.circle,
              ),
              todayDecoration: BoxDecoration(
                color: Colors.orange.shade200,
                shape: BoxShape.circle,
              ),
              selectedDecoration: BoxDecoration(
                color: Theme.of(context).colorScheme.primary,
                shape: BoxShape.circle,
              ),
            ),
            headerStyle: const HeaderStyle(
              formatButtonVisible: false,
              titleCentered: true,
            ),
            onDaySelected: (selectedDay, focusedDay) {
              setState(() {
                _selectedDay = selectedDay;
                _focusedDay = focusedDay;
              });
            },
            onPageChanged: (focusedDay) {
              _focusedDay = focusedDay;
            },
          ),
          const SizedBox(height: 16),
          if (_selectedDay != null) ...[
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Text(
                'Birthdays on ${_selectedDay!.month}/${_selectedDay!.day}',
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
              ),
            ),
            const SizedBox(height: 12),
          ],
          Expanded(
            child: _buildBirthdayList(),
          ),
        ],
      ),
    );
  }

  Widget _buildBirthdayList() {
    if (_selectedDay == null) {
      return const Center(
        child: Text('Select a day to see birthdays'),
      );
    }

    final normalizedDay = DateTime(
      _selectedDay!.year,
      _selectedDay!.month,
      _selectedDay!.day,
    );
    final birthdaysOnDay = _birthdays[normalizedDay] ?? [];

    if (birthdaysOnDay.isEmpty) {
      return const Center(
        child: Text('No birthdays on this day'),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: birthdaysOnDay.length,
      itemBuilder: (context, index) {
        final name = birthdaysOnDay[index];
        return Card(
          child: ListTile(
            leading: CircleAvatar(
              child: Text(
                name[0],
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
            title: Text(name),
            subtitle: const Text('Tap for details'),
            trailing: const Icon(Icons.cake),
            onTap: () {
              // TODO: Navigate to person detail
            },
          ),
        );
      },
    );
  }
}
