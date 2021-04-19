import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Linking } from "react-native";
import { Button, ActivityIndicator } from "@ant-design/react-native";
import Header from "../../components/header/Header";
import Modal from "../../components/child-components/Modal";
import { Secondary } from "../../constants/colors";
import { getTrackingId } from "../../api/firebase/backend";
export default function TrackOrder(props) {
  const [trackingId, setTrackingId] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [containerOpacity, setcontainerOpacity] = useState(0.3);
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    getTrackingId()
      .then((id) => {
        setTrackingId(id);
        setLoading(false);
        setcontainerOpacity(1);
      })
      .catch((err) => {
        showModal();
      });
    // Screen focus handler
    const unsubscribe = props.navigation.addListener("didFocus", () => {
      getTrackingId()
        .then((id) => {
          setTrackingId(id);
          setLoading(false);
          setcontainerOpacity(1);
        })
        .catch((err) => {
          showModal();
        });
    });
    return () => unsubscribe;
  }, []);
  const openDrawerFn = () => {
    props.navigation.toggleDrawer();
  };
  const _handleTracking = () => {
    Linking.openURL("https://ep.gov.pk/");
  };
  const showModal = () => {
    setIsModalVisible(true);
    setcontainerOpacity(0.1);
  };
  const hideModal = () => {
    setIsModalVisible(false);
    setcontainerOpacity(1);
    props.navigation.navigate("CopyFormHomePage");
  };
  return (
    <>
      <Modal
        visible={isModalVisible}
        text="Your order is not posted yet or you don't have any order."
        urduText="براۓ مہربانی مزید نقل فارم کے لیے اپنے واجبات ادا کریں۔"
        buttonOkText="OK"
        hideModal={hideModal}
        handleOkay={hideModal}
      />
      <Header title={"Track Order"} openDrawerFn={openDrawerFn} />
      <View style={[styles.centeredView, { opacity: containerOpacity }]}>
        <Text style={styles.label}>Tracking Id of your current order is:</Text>
        <Text style={styles.trackingId}>{trackingId}</Text>
        <Text style={styles.info}>
          Clicking the button below would open a website. Enter Tracking Id in
          the top right corner of the website.
        </Text>
        <Button
          style={styles.btnTrackOrder}
          type="primary"
          onPress={_handleTracking}
        >
          Track Order
        </Button>
      </View>
      <ActivityIndicator animating={isLoading} toast size="large" />
    </>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  label: {
    width: "90%",
    marginBottom: 20,
    fontSize: 16,
  },
  trackingId: {
    fontSize: 24,
    fontWeight: "bold",
    maxWidth: "90%",
  },
  info: {
    width: "90%",
    marginTop: 40,
    marginBottom: 20,
  },
  btnTrackOrder: {
    width: "90%",
    height: 50,
    backgroundColor: Secondary,
    borderWidth: 0,
  },
});
