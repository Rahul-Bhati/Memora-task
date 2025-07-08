import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, ScrollView } from 'react-native';
import { Clock } from 'lucide-react-native';

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
}

export const TimePicker: React.FC<TimePickerProps> = ({ value, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(timeString);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Reminder Time</Text>
        <ScrollView nestedScrollEnabled={true} style={styles.pickerContainer}>
          <Clock size={20} color="#6B7280" />
          <input
            type="time"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              fontSize: 16,
              padding: 8,
              backgroundColor: 'transparent',
              flex: 1,
            }}
          />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Reminder Time</Text>
      <TouchableOpacity
        style={styles.pickerContainer}
        onPress={() => setShowPicker(!showPicker)}
      >
        <Clock size={20} color="#6B7280" />
        <Text style={styles.timeText}>{formatTime(value)}</Text>
      </TouchableOpacity>

      {showPicker && (
        <View style={styles.optionsContainer}>
          {timeOptions.map((time) => (
            <TouchableOpacity
              key={time}
              style={[styles.option, time === value && styles.selectedOption]}
              onPress={() => {
                onChange(time);
                setShowPicker(false);
              }}
            >
              <Text style={[styles.optionText, time === value && styles.selectedOptionText]}>
                {formatTime(time)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  timeText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  optionsContainer: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginTop: 4,
  },
  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  selectedOption: {
    backgroundColor: '#EBF8FF',
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
  },
  selectedOptionText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
});