import { AuthTag } from "asv-hlps/lib/cjs/models/entities/auth/AuthTag";
import { AuthTagCat } from "asv-hlps/lib/cjs/models/entities/auth/AuthTagCat";
import React from "react";
import { Accordion, Badge } from "react-bootstrap";

export const AuthTagSlot = ({ tagCats, onCheckTag }) => {
  // const { tobs: tagCats } = useReadonlyFetchTobs(httpService, "authtagcats/menu");

  const getTagSlots = (tags: string[], userTags: string[]) => {
    let map = {};
    tags.forEach((i) => (map[i] = false));
    userTags.forEach((i) => map[i] === false && (map[i] = true));
    return Object.keys(map).map((k, i) => ({ id: i, name: k, isChecked: map[k] }));
  };

  const getPermissions = (tagCats: AuthTagCat[], userTags: AuthTag[], checks: any[]) => {
    // ------ tag names ------
    const tagNames: string[] = [];
    for (const cat of tagCats) {
      for (const tag of cat.tags) {
        tagNames.push(tag.name);
      }
    }

    // ------ user tag names ------
    const userTagNames: string[] = [];

    if (userTags) {
      for (const tag of userTags) {
        userTagNames.push(tag.name);
        // ------ checked existing tags ------
        tag.isChecked = true;
        checks.push(tag);
      }
    }
    // ------ create grp tags ------
    const grpTags = getTagSlots(tagNames, userTagNames);
    // ------ add isChecked on tags ------
    for (const cat of tagCats) {
      for (const tag of cat.tags) {
        for (const grp of grpTags) {
          if (tag.name === grp.name) {
            tag.isChecked = grp.isChecked;
          }
        }
      }
    }
    return tagCats;
  };

  /* const onCheckTag = (e, tag) => {
    console.log(e.target.checked);
    console.log(tag);
  }; */

  const handleCheckTag = (e, tag) => {
    onCheckTag({ checked: e.target.checked, tag });
  };

  const userTagsLength = (tags: AuthTag[]): number => {
    if (!tags) {
      return 0;
    }
    let countLength = 0;
    for (const tag of tags) {
      if (tag.isChecked) {
        countLength++;
      }
    }
    return countLength;
  };
  console.log(tagCats);
  return (
    <Accordion defaultActiveKey="0" id="accordion">
      {/* React.Children.toArray() */}
      {React.Children.toArray(
        tagCats.map((cat) => (
          <Accordion.Item eventKey={String(cat.id)}>
            <Accordion.Header className="text-uppercase">
              <i className="mdi mdi-help-circle me-1 text-primary"></i>
              <span className="text-uppercase fw-bold">{cat.name}</span>
              <Badge className="mx-1 p-1" bg="info">
                {cat.tags?.length}
              </Badge>
              <Badge className="mx-1 p-1" bg="success">
                {userTagsLength(cat?.tags)}
              </Badge>
              {/* <span className="text-right badge badge-success ml-3"> {userTagsLength(cat?.tags)} </span> */}
            </Accordion.Header>
            <Accordion.Body>
              {React.Children.toArray(
                cat.tags.map((tag) => (
                  <button type="button" className="btn btn-soft-secondary m-2 ">
                    <span className="fs-12 px-2">{tag.name}</span>

                    {/* <input type="checkbox" name="tag.id" checked={tag.isChecked} onChange={(e) => onCheckTag(e, tag)} value={tag.name} /> */}
                    <input
                      type="checkbox"
                      name="tag.id"
                      checked={tag.isChecked}
                      onChange={(e) => handleCheckTag(e, tag)}
                      value={tag.name}
                    />
                  </button>
                ))
              )}
            </Accordion.Body>
          </Accordion.Item>
        ))
      )}
    </Accordion>
  );
};
