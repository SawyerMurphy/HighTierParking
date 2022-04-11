#-----------------------------------------------------------------------
# File highTierParking.py
# Software module of embedded system
# Opens live stream when object is detected within 0.5 - 1m  for at least 5s
# Code for video capturing has been commented out
#
# CEG 4913; Capstone Winter 2022
# Author: Nathan Dizon-Mapula
# Sources used: Freenove Ultimate Starter Kit for Raspberry Pi Tutorial
#-----------------------------------------------------------------------

import RPi.GPIO as GPIO
import time
import os
import subprocess
from subprocess import call

from PCF8574 import PCF8574_GPIO
from Adafruit_LCD1602 import Adafruit_CharLCD

from picamera import PiCamera #needed for video

from time import sleep, strftime
from datetime import datetime

#=======================================================================
# Global Variables
#=======================================================================

trigPin = 16
echoPin = 18
MAX_DISTANCE = 220          # define the maximum measuring distance, unit: cm
timeOut = MAX_DISTANCE*60   # calculate timeout according to the maximum measuring distance

#camera = PiCamera() # <- uncomment if planning to record video instead of live stream
counter = 0					#counter for video file saving

# Obtain objects to operate PCF8574 port and LCD1602
# Requires PCF8574.py & Adafruit_LCD1602.py to exist within same directory
PCF8574_address = 0x27  	# I2C address of the PCF8574 chip.
PCF8574A_address = 0x3F  	# I2C address of the PCF8574A chip.

# Create PCF8574 GPIO adapter.
try:
    mcp = PCF8574_GPIO(PCF8574_address)
except:
    try:
        mcp = PCF8574_GPIO(PCF8574A_address)
    except:
        print ('I2C Address Error !')
        exit(1)
        
# Create LCD, passing in MCP GPIO adapter.
lcd = Adafruit_CharLCD(pin_rs=0, pin_e=2, pins_db=[4,5,6,7], GPIO=mcp)

#=======================================================================
# Local Functions
#=======================================================================

'''
Description: Obtain pulse time of a pin. Returns the length of the pulse
			 in microseconds, or 0 if no pulse is completed before the
			 timeout.

param pin - pin which time pulse is being read
param level - output level (High or Low)
param timeOut - time period of max distance
************************************************************************
'''
def pulseIn(pin,level,timeOut): 
    t0 = time.time()
    while(GPIO.input(pin) != level):
        if((time.time() - t0) > timeOut*0.000001):
            return 0;
    t0 = time.time()
    while(GPIO.input(pin) == level):
        if((time.time() - t0) > timeOut*0.000001):
            return 0;
    pulseTime = (time.time() - t0)*1000000
    return pulseTime

'''
Description: Begin measurements of ultrasonic ranging module and returns
             the measured distance in cm
************************************************************************
'''
def getSonar():     
    GPIO.output(trigPin,GPIO.HIGH)      			# make trigPin output 10us HIGH level 
    time.sleep(0.00001)     						# 10us
    GPIO.output(trigPin,GPIO.LOW) 					# make trigPin output LOW level 
    pingTime = pulseIn(echoPin,GPIO.HIGH,timeOut)   # read plus time of echoPin
    distance = pingTime * 340.0 / 2.0 / 10000.0     # calculate distance with sound speed 340m/s 
    return distance

'''    
Description: Start a live stream subprocess using raspivid command. Kills
			 subprocess after stream ends. Sleep value must be edited to 
			 respect how long stream is on for.
			 
			 -o for output, set to none
			 -t time in ms that video is transmitted. n=0 for infinite
			 -n no preview
			 -w width of video stream
			 -h height of video stream
			 -fps frames per second
			 | cvlc pipe to stream video using h264 codev via real time streaming protocol over LAN
			 
			 # To access video stream on LAN system open VLC Media Player
			 # Open Network Stream
			 # rtsp://<hostname>:8080/
************************************************************************
'''
def runstream():
    raspivid = subprocess.Popen("raspivid -o - -t 10000 -n -w 800 -h 600 -fps 12  | cvlc -vvv stream:///dev/stdin --sout '#rtp{sdp=rtsp://:8080/}' :demux=h264", shell=True)
    sleep(12)
    call (["pkill raspivid"], shell=True)

'''    
Description: Captures video and saves it to file location /home/pi/Capstone/Pictures/video%s.h264'
		     
		     NOT IMPLEMENTED:
		     Module requires socket programming to transfer video to external system
************************************************************************
'''   
def record():
    global counter
    #camera.start_preview()
    camera.start_recording('/home/pi/Capstone/Pictures/video%s.h264' % counter)
    sleep(10)
    camera.stop_recording()
    #camera.stop_preview()
    lcd.clear()
    lcd.message("Video captured\n")
    print ("Video captured, stored as Video%s.h264" % counter)
    
    counter+=1	

'''    
Description: Set up pins
************************************************************************
'''   
def setup():
    GPIO.setmode(GPIO.BOARD)      	# use PHYSICAL GPIO Numbering
    GPIO.setup(trigPin, GPIO.OUT)   # set trigPin to OUTPUT mode
    GPIO.setup(echoPin, GPIO.IN)    # set echoPin to INPUT mode

'''    
Description: Main loop. Takes measurement distances and determines 
			 status that system is in.
************************************************************************
''' 
def loop():
    mcp.output(3,1)     # turn on LCD backlight
    lcd.begin(16,2)     # set number of LCD lines and columns
    while True:
        distance = getSonar() 	# get distance         
        lcd.setCursor(0,0)  	# set cursor position
        
        # Standby mode
        if (distance < 50 or distance > 100):
            lcd.message("STANDBY\n")
            
        # System detects object within required range
        if (distance > 50 and distance < 100):
            lcd.message("System in use\n")
            dst1 = distance
            print ("distance 1 : %.2f cm"%(dst1))
            sleep(5)
            distance = getSonar()
            dst2 = distance
            print ("distance 2 : %.2f cm"%(dst2))
            
            # Start video streaming/video capture
            if (dst2 <= dst1):						
                print ("System now in use, opening video stream")
                lcd.clear()
                lcd.message("Video stream on\n")
                runstream() #replace with record function for video capture
                lcd.clear()
                print ("close video stream")
                sleep(5)       
        print ("distance : %.2f cm"%(distance))
        time.sleep(1)

'''    
Description: Clears display, must be called when program ends.
************************************************************************
'''         
def destroy():
    lcd.clear()

#=======================================================================
# Main Program
#=======================================================================
if __name__ == '__main__':
    print ('Program is starting ... ')
    setup()
    try:
        loop()
    except KeyboardInterrupt:  # ctrl-c to end the program
        print ('\nProgram ending ')
        destroy()
        GPIO.cleanup()         # release GPIO resource
        
