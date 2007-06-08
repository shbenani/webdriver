#include <ExDisp.h>
#include "stdafx.h"
#include "utils.h"
#include "DocumentNode.h"
#include <iostream>

using namespace std;

DocumentNode* getDocumentNode(JNIEnv *env, jobject obj)
{
	jclass cls = env->GetObjectClass(obj);
	jfieldID fid = env->GetFieldID(cls, "nodePointer", "J");
	jlong value = env->GetLongField(obj, fid);

	return (DocumentNode *) value;
}

#ifdef __cplusplus
extern "C" {
#endif

JNIEXPORT jboolean JNICALL Java_com_thoughtworks_webdriver_ie_DocumentNode_hasNextChild
  (JNIEnv *env, jobject obj) 
{
	DocumentNode* doc = getDocumentNode(env, obj);
	return (jboolean) doc->hasNextChild();
}

JNIEXPORT jobject JNICALL Java_com_thoughtworks_webdriver_ie_DocumentNode_nextChild
  (JNIEnv *env, jobject obj)
{
	DocumentNode* doc = getDocumentNode(env, obj);
	Node* child = doc->getNextChild();

	//cout << "Document next child: " << child->name() << endl;

	jclass clazz = env->FindClass("com/thoughtworks/webdriver/ie/ElementNode");
	jmethodID cId = env->GetMethodID(clazz, "<init>", "(J)V");
	return env->NewObject(clazz, cId, (jlong) child);
}

#ifdef __cplusplus
}
#endif